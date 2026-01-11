import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const { userId } = await auth();

    if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    try {
        const prompts = await prisma.prompt.findMany({
            where: {
                userId,
                parentId: null, // Only fetch top-level parents in the list? Or all? User likely wants to see main prompts. 
                // If we only show parents, edits are hidden inside parents? 
                // Requirement said: "Edited prompts ... linked to original ... rather than creating multiple entries".
                // So yes, we should probably mostly show parents or "latest".
                // For now, let's just fetch all sorted by createdAt desc, logic for display can happen on frontend or we filter here.
                // Actually, previous logic was fetching all. Reverting to fetch all but paginated.
                // Wait, if I hide children here, the frontend logic for "Edited Version" badge might depend on prompt props?
                // The frontend renders `prompts.map`. If children are fetched as separate items, they look like separate history.
                // But the "edit" logic we built saves them as new prompts with `parentId`.
                // If we want to clean up history, we should probably ONLY fetch `parentId: null` here, 
                // AND include children relation to get the latest version data?
                // For this step, let's keep it simple: paginated fetch of *everything* for now to match current behavior, 
                // OR better: fetch `where: { parentId: null }` and `include: { children: { orderBy: { createdAt: 'desc' }, take: 1 } }`.
                // The user said "create a single, updatable 'latest edited version'".
                // The save route *creates* or *updates* a child.
                // So a parent has at most ONE child (conceptually).
                // It's cleaner to show 1 item per "thread".
                // Let's filter to `parentId: null`.
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit + 1, // Fetch one extra to check for more
            skip: skip,
            include: {
                children: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        });

        const hasMore = prompts.length > limit;
        const items = hasMore ? prompts.slice(0, limit) : prompts;

        return NextResponse.json({
            items,
            hasMore
        });
    } catch (error) {
        console.error('[HISTORY_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
