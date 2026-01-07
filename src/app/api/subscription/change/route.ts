import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { plan } = body;

        if (!["FREE", "PRO"].includes(plan)) {
            return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
        }

        // @ts-ignore
        const userId = session.user.id;

        // In a real app, this would integrate with Stripe/MP
        // For MVP, we just update the DB directly

        // Deactivate current active subscriptions
        await prisma.subscription.updateMany({
            where: { userId, status: "ACTIVE" },
            data: { status: "CANCELED", endsAt: new Date() }
        });

        // Create new subscription
        await prisma.subscription.create({
            data: {
                userId,
                plan,
                status: "ACTIVE",
                startedAt: new Date(),
                // For PRO, assuming 30 days
                endsAt: plan === "PRO" ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null
            }
        });

        return NextResponse.json({ success: true, plan });

    } catch (error) {
        console.error("Subscription Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
