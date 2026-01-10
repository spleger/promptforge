import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
    const { userId } = await auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const prompts = await prisma.prompt.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 50, // Limit to recent 50 for now
        });

        return NextResponse.json(prompts);
    } catch (error) {
        console.error('[HISTORY_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
