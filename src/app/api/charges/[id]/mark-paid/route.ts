import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const { id } = await context.params;

        // Verify ownership
        const charge = await prisma.charge.findUnique({
            where: { id },
        });

        if (!charge) {
            return NextResponse.json({ error: "Cobrança não encontrada" }, { status: 404 });
        }

        // @ts-ignore
        if (charge.userId !== (session.user as any).id) {
            return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
        }

        // Mark as paid
        const updated = await prisma.charge.update({
            where: { id },
            data: {
                status: 'PAID',
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error marking charge as paid:", error);
        return NextResponse.json(
            { error: "Erro ao marcar como pago" },
            { status: 500 }
        );
    }
}
