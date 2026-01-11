import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Default settings for new users
const DEFAULT_SETTINGS = {
    defaultModel: 'claude-sonnet-4-5-20250929',
    defaultLevel: 'standard',
    enabledSites: ['chatgpt.com', 'claude.ai', 'gemini.google.com', 'notebooklm.google.com'],
};

// GET: Retrieve user's settings
export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(DEFAULT_SETTINGS);
        }

        const settings = await prisma.userSettings.findUnique({
            where: { userId },
        });

        if (!settings) {
            return NextResponse.json(DEFAULT_SETTINGS);
        }

        return NextResponse.json({
            defaultModel: settings.defaultModel,
            defaultLevel: settings.defaultLevel,
            enabledSites: settings.enabledSites,
        });
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json(DEFAULT_SETTINGS);
    }
}

// POST: Update user's settings
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { defaultModel, defaultLevel, enabledSites } = body;

        // Validate input
        const validLevels = ['light', 'standard', 'comprehensive'];
        if (defaultLevel && !validLevels.includes(defaultLevel)) {
            return NextResponse.json(
                { error: 'Invalid enhancement level' },
                { status: 400 }
            );
        }

        // Upsert settings
        const settings = await prisma.userSettings.upsert({
            where: { userId },
            update: {
                ...(defaultModel && { defaultModel }),
                ...(defaultLevel && { defaultLevel }),
                ...(enabledSites && { enabledSites }),
            },
            create: {
                userId,
                defaultModel: defaultModel || DEFAULT_SETTINGS.defaultModel,
                defaultLevel: defaultLevel || DEFAULT_SETTINGS.defaultLevel,
                enabledSites: enabledSites || DEFAULT_SETTINGS.enabledSites,
            },
        });

        return NextResponse.json({
            defaultModel: settings.defaultModel,
            defaultLevel: settings.defaultLevel,
            enabledSites: settings.enabledSites,
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json(
            { error: 'Failed to update settings' },
            { status: 500 }
        );
    }
}
