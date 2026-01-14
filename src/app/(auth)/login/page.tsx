"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Suspense } from "react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (searchParams.get("registered")) {
            setSuccess("Conta criada com sucesso! Faça login para continuar.");
        }
        if (searchParams.get("error")) {
            setError("Erro ao autenticar. Verifique suas credenciais.");
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Email ou senha incorretos.");
            setLoading(false);
        } else {
            router.push("/dashboard");
            router.refresh();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {success && (
                <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm border border-green-100">
                    {success}
                </div>
            )}
            {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
                    {error}
                </div>
            )}

            <Input
                label="Email"
                type="email"
                placeholder="nome@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <Input
                label="Senha"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                endIcon={
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="focus:outline-none hover:text-slate-600"
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                }
            />

            <div className="flex justify-end">
                <Link href="/forgot-password" className="text-xs text-primary-600 hover:text-primary-500 font-medium transition-colors">
                    Esqueceu a senha?
                </Link>
            </div>

            <div className="pt-2">
                <Button type="submit" fullWidth disabled={loading} className="w-full">
                    {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                    Entrar
                </Button>
            </div>
        </form>
    );
}

export default function LoginPage() {
    return (
        <div className="space-y-6">
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-heading font-bold text-slate-800">Bem-vindo de volta</h2>
                <p className="text-slate-500 mt-2">Acesse sua conta para gerenciar cobranças.</p>
            </div>

            <Suspense fallback={<div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-primary-500" /></div>}>
                <LoginForm />
            </Suspense>

            <div className="text-center text-sm text-slate-500">
                Não tem uma conta?{" "}
                <Link href="/register" className="font-semibold text-primary-600 hover:text-primary-500">
                    Criar conta grátis
                </Link>
            </div>
        </div>
    );
}
