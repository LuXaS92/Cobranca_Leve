import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hash } from "bcryptjs";
import { z } from "zod";

const updateProfileSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").optional(),
    email: z.string().email("Email inválido").optional(),
    currentPassword: z.string().min(6).optional(),
    newPassword: z.string().min(6).optional(),
    mpAccessToken: z.string().optional(),
    paymentInfo: z.string().optional(),
    image: z.string().optional(),
});

export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        // @ts-ignore
        const userId = session.user.id;
        const body = await req.json();

        const { name, email, currentPassword, newPassword, mpAccessToken, paymentInfo, image } = updateProfileSchema.parse(body);

        // Get current user data
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        const updateData: any = {};

        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (mpAccessToken !== undefined) updateData.mpAccessToken = mpAccessToken;
        if (paymentInfo !== undefined) updateData.paymentInfo = paymentInfo;
        if (image !== undefined) updateData.image = image;

        // Handle password update if provided
        if (newPassword) {
            // Must provide current password to change it
            if (!currentPassword) {
                return NextResponse.json(
                    { error: "Senha atual é obrigatória para definir uma nova senha" },
                    { status: 400 }
                );
            }

            // Verify current password (using dynamic import to avoid bcryptjs edge issues if any, though standard import is fine here)
            // But we already imported hash, so we need compare
            const { compare } = await import("bcryptjs");
            const isValid = await compare(currentPassword, user.password);

            if (!isValid) {
                return NextResponse.json(
                    { error: "Senha atual incorreta" },
                    { status: 400 }
                );
            }

            updateData.password = await hash(newPassword, 12);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                mpAccessToken: true,
                paymentInfo: true,
                image: true,
                // Exclude password
            },
        });

        return NextResponse.json(updatedUser);

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
        }
        console.error("Error updating profile:", error);
        return NextResponse.json(
            { error: "Erro ao atualizar perfil" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        // @ts-ignore
        const userId = session.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                email: true,
                mpAccessToken: true,
                paymentInfo: true,
                image: true,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar perfil" }, { status: 500 });
    }
}
