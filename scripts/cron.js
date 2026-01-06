#!/usr/bin/env node

/**
 * Standalone cron process for scheduling charge reminders
 * Run this in a separate process: node scripts/cron.js
 */

// Load environment variables
require('dotenv').config();

// Import and start the cron
const { startChargeReminderCron } = require('../src/lib/cron/charge-scheduler');

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
