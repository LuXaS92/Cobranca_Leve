import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { processChargeReminders } from '@/lib/cron/charge-scheduler';

// Manual trigger endpoint for testing
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    // Only allow authenticated users to trigger (or add API key auth for production)
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        console.log(`🔧 Manual trigger by user ${(session.user as any).email}`);

        const result = await processChargeReminders();

        return NextResponse.json({
            success: true,
            message: 'Charge reminders processed successfully',
            ...result,
        });
    } catch (error: any) {
        console.error('Error processing charge reminders:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to process charge reminders',
            },
            { status: 500 }
        );
    }
}

// GET endpoint to check status
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
        status: 'ready',
        cronEnabled: process.env.CRON_ENABLED !== 'false',
        cronSchedule: process.env.CRON_SCHEDULE || '0 8 * * *',
        redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    });
}
