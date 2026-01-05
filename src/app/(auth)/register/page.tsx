"use client"

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const registerSchema = z.object({
    name: z.string().min(2, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterForm) => {
        setLoading(true);
        setServerError("");

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.message || "Erro ao criar conta");
            }

            // Success
            router.push("/login?registered=true");
        } catch (err: any) {
            setServerError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-heading font-bold text-slate-800">Crie sua conta</h2>
                <p className="text-slate-500 mt-2">Comece a cobrar de forma leve e eficaz.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {serverError && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
                        {serverError}
                    </div>
                )}

                <Input
                    label="Nome Completo"
                    placeholder="Seu nome"
                    {...register("name")}
                    error={errors.name?.message}
                />

                <Input
                    label="Email"
                    type="email"
                    placeholder="nome@exemplo.com"
                    {...register("email")}
                    error={errors.email?.message}
                />

                <Input
                    label="Senha"
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                    error={errors.password?.message}
                />

                <div className="pt-2">
                    <Button type="submit" fullWidth disabled={loading}>
                        {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                        Criar conta
                    </Button>
                </div>
            </form>

            <div className="text-center text-sm text-slate-500">
                Já tem uma conta?{" "}
                <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-500">
                    Entrar
                </Link>
            </div>
        </div>
    );
}
