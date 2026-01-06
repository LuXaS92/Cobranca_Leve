"use client"

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        setSent(true);
    };

    return (
        <div className="space-y-6">
            <div className="text-center md:text-left">
                <Link
                    href="/login"
                    className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-6 transition-colors"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Voltar para o login
                </Link>
                <h2 className="text-3xl font-heading font-bold text-slate-800">Recuperar Senha</h2>
                <p className="text-slate-500 mt-2">
                    {sent
                        ? "Email enviado com instruções!"
                        : "Digite seu email para receber o link de redefinição."}
                </p>
            </div>

            {sent ? (
                <div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-center space-y-4 animate-in fade-in zoom-in duration-300">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                        <CheckCircle2 size={24} />
                    </div>
                    <p className="text-slate-700">
                        Enviamos um email para <strong>{email}</strong> com as instruções para redefinir sua senha.
                    </p>
                    <p className="text-xs text-slate-500">
                        Não recebeu? Verifique sua caixa de spam ou tente novamente em alguns minutos.
                    </p>
                    <Button
                        variant="outline"
                        fullWidth
                        onClick={() => setSent(false)}
                        className="mt-4"
                    >
                        Tentar outro email
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="nome@exemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoFocus
                    />

                    <div className="pt-2">
                        <Button type="submit" fullWidth disabled={loading} className="w-full btn-primary">
                            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                            Enviar Link de Recuperação
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
