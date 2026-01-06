import { Worker, Job } from 'bullmq';
import { ChargeReminderJob } from './index';
import { sendChargeReminder } from '../services/charge-reminder';

// Worker to process charge reminder jobs
export const chargeReminderWorker = new Worker<ChargeReminderJob>(
    'charge-reminders',
    async (job: Job<ChargeReminderJob>) => {
        console.log(`[Worker] Processing job ${job.id}:`, job.data);

        try {
            await sendChargeReminder(job.data);
            console.log(`[Worker] Successfully processed job ${job.id}`);
            return { success: true };
        } catch (error) {
            console.error(`[Worker] Failed to process job ${job.id}:`, error);
            throw error; // Will trigger retry
        }
    },
    {
        connection: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
        },
        concurrency: 5, // Process up to 5 jobs concurrently
    }
);

// Event listeners
chargeReminderWorker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed`);
});

chargeReminderWorker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed:`, err.message);
});

chargeReminderWorker.on('error', (err) => {
    console.error('Worker error:', err);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    await chargeReminderWorker.close();
});

console.log('🔄 Charge reminder worker started');
