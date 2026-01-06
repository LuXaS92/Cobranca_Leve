#!/usr/bin/env tsx

/**
 * Standalone cron process for scheduling charge reminders
 * Run this in a separate process: npm run cron
 */

// Import and start the cron
import { startChargeReminderCron } from '../src/lib/cron/charge-scheduler';

startChargeReminderCron();

console.log('Press Ctrl+C to stop');

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down cron...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n👋 Shutting down cron...');
    process.exit(0);
});
