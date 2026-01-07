"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface PlanActionsProps {
    plan: "FREE" | "PRO";
    isCurrent: boolean;
}

export function PlanActions({ plan, isCurrent }: PlanActionsProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubscriptionChange = async () => {
        if (!confirm(`Tem certeza que deseja mudar para o plano ${plan}?`)) return;

        setLoading(true);
        try {
            const res = await fetch('/api/subscription/change', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Erro ao alterar plano");
            }

            alert(`Plano alterado para ${plan} com sucesso!`);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Erro ao processar solicitação");
        } finally {
            setLoading(false);
        }
    };

    if (isCurrent) {
        if (plan === "PRO") {
            return (
                <Button variant="secondary" fullWidth className="bg-white text-primary-600 hover:bg-white/90" disabled>
                    Plano Atual
                </Button>
            )
        }
        return (
            <Button variant="outline" fullWidth disabled>
                Plano Atual
            </Button>
        );
    }

    if (plan === "PRO") {
        return (
            <Button
                onClick={handleSubscriptionChange}
                variant="secondary"
                fullWidth
                disabled={loading}
                className="bg-white text-primary-600 hover:bg-white/90"
            >
                {loading ? <Loader2 className="animate-spin" /> : "Fazer Upgrade"}
            </Button>
        );
    }

    // Downgrade to FREE
    return (
        <Button
            onClick={handleSubscriptionChange}
            variant="outline"
            fullWidth
            disabled={loading}
        >
            {loading ? <Loader2 className="animate-spin" /> : "Voltar para Gratuito"}
        </Button>
    );
}
