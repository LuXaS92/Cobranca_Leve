import * as cron from 'node-cron';
import { prisma } from '../prisma';
import { enqueueChargeReminder } from '../queue';
import { getReminderType } from '../services/charge-reminder';

let cronJob: cron.ScheduledTask | null = null;

export async function processChargeReminders() {
    console.log('🔄 [Cron] Starting charge reminder processing...');

    try {
        // Fetch all pending charges
        const charges = await prisma.charge.findMany({
            where: {
                status: 'PENDING',
            },
            include: {
                client: true,
            },
        });

        console.log(`📊 [Cron] Found ${charges.length} pending charges`);

        let enqueuedCount = 0;

        for (const charge of charges) {
            const reminderType = getReminderType(charge);

            if (reminderType) {
                try {
                    await enqueueChargeReminder({
                        chargeId: charge.id,
                        reminderType,
                        userId: charge.userId,
                    });
                    enqueuedCount++;
                    console.log(`✅ [Cron] Enqueued ${reminderType} reminder for charge ${charge.id}`);
                } catch (error: any) {
                    // Job might already exist (duplicate), that's OK
                    if (error.message?.includes('already exists')) {
                        console.log(`⏭️  [Cron] Reminder already queued for charge ${charge.id}`);
                    } else {
                        console.error(`❌ [Cron] Failed to enqueue reminder for charge ${charge.id}:`, error);
                    }
                }
            }
        }

        console.log(`✅ [Cron] Finished processing. Enqueued ${enqueuedCount} reminders.`);

        return {
            success: true,
            totalCharges: charges.length,
            enqueuedReminders: enqueuedCount,
        };
    } catch (error) {
        console.error('❌ [Cron] Error processing charge reminders:', error);
        throw error;
    }
}

export function startChargeReminderCron() {
    if (cronJob) {
        console.log('⚠️  Cron job already running');
        return;
    }

    const schedule = process.env.CRON_SCHEDULE || '0 8 * * *'; // Default: 8 AM daily
    const enabled = process.env.CRON_ENABLED !== 'false'; // Default: enabled

    if (!enabled) {
        console.log('⏸️  Cron job disabled via CRON_ENABLED env var');
        return;
    }

    cronJob = cron.schedule(schedule, async () => {
        console.log(`⏰ [Cron] Triggered at ${new Date().toISOString()}`);
        await processChargeReminders();
    });

    console.log(`🚀 Charge reminder cron job started with schedule: ${schedule}`);
}

export function stopChargeReminderCron() {
    if (cronJob) {
        cronJob.stop();
        cronJob = null;
        console.log('🛑 Cron job stopped');
    }
}

// Auto-start if this file is run directly (for development)
if (require.main === module) {
    startChargeReminderCron();
    console.log('Running in standalone mode. Press Ctrl+C to exit.');
}
