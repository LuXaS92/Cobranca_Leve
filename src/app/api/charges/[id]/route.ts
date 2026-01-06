import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const { id } = await context.params;
        const body = await request.json();

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

        // Update charge
        const updated = await prisma.charge.update({
            where: { id },
            data: {
                amount: body.amount ? parseFloat(body.amount) : undefined,
                dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
                messageType: body.messageType,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating charge:", error);
        return NextResponse.json(
            { error: "Erro ao atualizar cobrança" },
            { status: 500 }
        );
    }
}
