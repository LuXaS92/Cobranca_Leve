"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

const createClientSchema = z.object({
    name: z.string().min(2, "Nome é obrigatório"),
    whatsapp: z.string().min(10, "WhatsApp inválido (apenas números)"), // Simple validation
    email: z.string().email("Email inválido").optional().or(z.literal("")),
});

export default function NewClientPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof createClientSchema>>({
        resolver: zodResolver(createClientSchema),
    });

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const res = await fetch("/api/clients", {
                method: "POST",
                body: JSON.stringify(data),
            });
            if (res.ok) {
                router.push("/dashboard/clients");
                router.refresh();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <Link href="/dashboard/clients" className="flex items-center text-slate-500 hover:text-slate-800 mb-6 text-sm">
                <ArrowLeft size={16} className="mr-1" /> Voltar
            </Link>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">Cadastrar Cliente</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Nome do Cliente"
                        placeholder="Ex: João Silva"
                        {...register("name")}
                        error={errors.name?.message}
                    />
                    <Input
                        label="WhatsApp (com DDD)"
                        placeholder="11999999999"
                        type="tel"
                        {...register("whatsapp")}
                        error={errors.whatsapp?.message}
                    />
                    <Input
                        label="Email (Opcional)"
                        placeholder="joao@exemplo.com"
                        type="email"
                        {...register("email")}
                        error={errors.email?.message}
                    />

                    <Button type="submit" fullWidth disabled={loading}>
                        {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                        Salvar Cliente
                    </Button>
                </form>
            </div>
        </div>
    );
}
