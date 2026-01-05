import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const createChargeSchema = z.object({
    clientId: z.string().uuid(),
    amount: z.string().transform(val => parseFloat(val)),
    dueDate: z.string(), // ISO Date
    messageType: z.literal("FRIENDLY").or(z.literal("NEUTRAL")).or(z.literal("PROFESSIONAL")),
});

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;

    try {
        const body = await req.json();
        const { clientId, amount, dueDate, messageType } = createChargeSchema.parse(body);

        // 1. Check Subscription Plan & Limits
        const subscription = await prisma.subscription.findFirst({
            where: { userId, status: "ACTIVE" },
            orderBy: { startedAt: "desc" }
        });

        const isPro = subscription?.plan === "PRO";

        if (!isPro) {
            // Check usage for current month
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            const count = await prisma.charge.count({
                where: {
                    userId,
                    createdAt: {
                        gte: startOfMonth
                    }
                }
            });

            if (count >= 3) {
                return NextResponse.json(
                    { message: "Limite do plano gratuito atingido (3 cobranças/mês). Faça upgrade para ilimitado." },
                    { status: 403 }
                );
            }
        }

        // 2. Create Charge
        const charge = await prisma.charge.create({
            data: {
                userId,
                clientId,
                amount,
                dueDate: new Date(dueDate),
                messageType,
                status: "PENDING",
                sentAt: new Date(), // Assuming sent immediately via WhatsApp button
            }
        });

        return NextResponse.json(charge);

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
        }
        console.error(error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
