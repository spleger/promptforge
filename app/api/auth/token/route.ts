import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/token
 * Returns a session token for the current user (for extension use).
 * This endpoint is called from the web app context where cookies work,
 * then the token is stored in the extension for cross-origin API calls.
 */
export async function GET() {
    try {
        const { userId, getToken } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Get a session token that can be verified server-side
        const token = await getToken();

        if (!token) {
            return NextResponse.json(
                { error: 'Could not generate token' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            token,
            userId,
            expiresIn: 60 * 60 // Token typically valid for 1 hour
        });
    } catch (error) {
        console.error('Token generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate token' },
            { status: 500 }
        );
    }
}
