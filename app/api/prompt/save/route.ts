import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SaveSchema = z.object({
    id: z.string().optional(), // Existing prompt ID (if updating)
    content: z.string(),
    parentId: z.string().optional(), // Original prompt ID
    originalInput: z.string().optional(),
    modelUsed: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const validation = SaveSchema.safeParse(body);

        if (!validation.success) {
            return Response.json({ error: 'Invalid input' }, { status: 400 });
        }

        const { id, content, parentId, originalInput, modelUsed } = validation.data;

        // Logic:
        // 1. If we have a parentId, we check if WE (this user) already have a child for this parent.
        //    If so, we update THAT child.
        //    If not, we create a new child.
        // 2. If no parentId, this is a new standalone save (or shouldn't happen in this flow).

        if (parentId) {
            // Check for existing child prompt by this user for this parent
            // We want to avoid creating infinite history chains for now, just 1 level deep (Original -> Edited)
            // or if we want a chain, we could do that too.
            // The user requirement: "only one though for the latest edited item that gets overwritten"

            const existingChild = await prisma.prompt.findFirst({
                where: {
                    userId,
                    parentId,
                },
            });

            if (existingChild) {
                // Update existing child
                const updated = await prisma.prompt.update({
                    where: { id: existingChild.id },
                    data: {
                        enhancedOutput: JSON.stringify({ text: content }), // Consistent JSON structure
                        // Update timestamp to bring it to top of history
                        createdAt: new Date(),
                    },
                });
                return Response.json({ id: updated.id });
            } else {
                // Create new child
                const newPrompt = await prisma.prompt.create({
                    data: {
                        userId,
                        originalInput: originalInput || '',
                        enhancedOutput: JSON.stringify({ text: content }),
                        modelUsed: modelUsed || 'manual-edit',
                        enhancement: JSON.stringify({ level: 'custom' }),
                        parentId,
                    },
                });
                return Response.json({ id: newPrompt.id });
            }
        }

        // Fallback/Direct update if ID provided (though we prefer the parentId flow)
        if (id) {
            const updated = await prisma.prompt.update({
                where: { id, userId },
                data: {
                    enhancedOutput: JSON.stringify({ text: content }),
                }
            });
            return Response.json({ id: updated.id });
        }

        return Response.json({ error: 'Missing parentId or id' }, { status: 400 });

    } catch (error) {
        console.error('Save error:', error);
        return Response.json({ error: 'Internal Error' }, { status: 500 });
    }
}
