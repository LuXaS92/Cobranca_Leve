#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function upgradeToPro() {
    try {
        // Get the most recent user
        const user = await prisma.user.findFirst({
            orderBy: { createdAt: 'desc' }
        });

        if (!user) {
            console.log('❌ No user found');
            return;
        }

        // Update their subscription to PRO
        const updated = await prisma.subscription.updateMany({
            where: { userId: user.id },
            data: { plan: 'PRO' }
        });

        console.log(`✅ Upgraded user ${user.email} to PRO plan!`);
        console.log(`   Updated ${updated.count} subscription(s)`);
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

upgradeToPro();
