import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const createClientSchema = z.object({
    name: z.string().min(2, "Nome é obrigatório"),
    whatsapp: z.string().min(10, "WhatsApp com DDD obrigatório"),
    email: z.string().email().optional().or(z.literal("")),
});

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;

    const clients = await prisma.client.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { charges: true } } }
    });

    return NextResponse.json(clients);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const data = createClientSchema.parse(body);

        // @ts-ignore
        const userId = session.user.id;

        const client = await prisma.client.create({
            data: {
                ...data,
                userId,
            },
        });

        return NextResponse.json(client);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
        }
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
