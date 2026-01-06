"use client"

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, Save } from "lucide-react";

export default function EditChargePage() {
    const router = useRouter();
    const params = useParams();
    const chargeId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [charge, setCharge] = useState<any>(null);

    const [amount, setAmount] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [messageType, setMessageType] = useState<"FRIENDLY" | "NEUTRAL" | "PROFESSIONAL">("FRIENDLY");

    useEffect(() => {
        fetchCharge();
    }, [chargeId]);

    const fetchCharge = async () => {
        try {
            const res = await fetch('/api/charges');
            const charges = await res.json();
            const foundCharge = charges.find((c: any) => c.id === chargeId);

            if (foundCharge) {
                setCharge(foundCharge);
                setAmount(Number(foundCharge.amount).toFixed(2));
                setDueDate(new Date(foundCharge.dueDate).toISOString().split('T')[0]);
                setMessageType(foundCharge.messageType);
            }
        } catch (error) {
            console.error('Error fetching charge:', error);
            alert('Erro ao carregar cobrança');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || !dueDate) {
            alert('Preencha todos os campos');
            return;
        }

        setSaving(true);
        try {
            const res = await fetch(`/api/charges/${chargeId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount,
                    dueDate,
                    messageType,
                }),
            });

            if (!res.ok) throw new Error('Erro ao atualizar');

            alert('Cobrança atualizada com sucesso!');
            router.push('/dashboard/charges');
        } catch (error) {
            console.error('Error updating charge:', error);
            alert('Erro ao atualizar cobrança. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
        );
    }

    if (!charge) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-bold text-slate-800 mb-2">Cobrança não encontrada</h2>
                <Link href="/dashboard/charges" className="text-primary-600 hover:underline">
                    Voltar para cobranças
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Link
                href="/dashboard/charges"
                className="flex items-center text-slate-500 hover:text-slate-800 mb-6 text-sm"
            >
                <ArrowLeft size={16} className="mr-1" /> Voltar para cobranças
            </Link>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                <h1 className="text-2xl font-heading font-bold text-slate-800 mb-6">
                    Editar Cobrança
                </h1>

                <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-600">Cliente</div>
                    <div className="font-semibold text-slate-900">{charge.client.name}</div>
                    <div className="text-sm text-slate-500">{charge.client.whatsapp}</div>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Valor (R$)
                        </label>
                        <Input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Data de Vencimento
                        </label>
                        <Input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Tom da Mensagem
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { value: 'FRIENDLY', label: 'Amigável', emoji: '😊' },
                                { value: 'NEUTRAL', label: 'Neutro', emoji: '👋' },
                                { value: 'PROFESSIONAL', label: 'Profissional', emoji: '👔' },
                            ].map((tone) => (
                                <button
                                    key={tone.value}
                                    type="button"
                                    onClick={() => setMessageType(tone.value as any)}
                                    className={`p-4 rounded-xl border-2 transition-all ${messageType === tone.value
                                            ? 'border-primary-500 bg-primary-50'
                                            : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    <div className="text-2xl mb-1">{tone.emoji}</div>
                                    <div className="text-sm font-medium text-slate-700">
                                        {tone.label}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            disabled={saving}
                            className="flex-1"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Salvar Alterações
                                </>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push('/dashboard/charges')}
                            disabled={saving}
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
