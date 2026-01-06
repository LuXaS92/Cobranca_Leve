import { Queue, QueueOptions } from 'bullmq';

// Queue configuration
const queueOptions: QueueOptions = {
    connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
    },
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
        removeOnComplete: {
            count: 100, // Keep last 100 completed jobs
        },
        removeOnFail: {
            count: 500, // Keep last 500 failed jobs for debugging
        },
    },
};

// Charge reminder queue
export const chargeReminderQueue = new Queue('charge-reminders', queueOptions);

// Job data interfaces
export interface ChargeReminderJob {
    chargeId: string;
    reminderType: 'before_due' | 'due_day' | 'overdue';
    userId: string;
}

// Helper to add job to queue
export async function enqueueChargeReminder(data: ChargeReminderJob) {
    return await chargeReminderQueue.add(
        `reminder-${data.reminderType}`,
        data,
        {
            jobId: `${data.chargeId}-${data.reminderType}`, // Prevent duplicates
        }
    );
}

// Graceful shutdown
process.on('SIGTERM', async () => {
    await chargeReminderQueue.close();
});
