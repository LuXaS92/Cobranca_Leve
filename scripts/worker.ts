#!/usr/bin/env tsx

/**
 * Standalone worker process for processing charge reminders
 * Run this in a separate process: npm run worker
 */

// Import and start the worker
import '../src/lib/queue/worker';

console.log('🚀 Worker process started');
console.log('📝 Logs will appear below as jobs are processed');
console.log('Press Ctrl+C to stop');

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down worker...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n👋 Shutting down worker...');
    process.exit(0);
});
