"use client"

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, CheckCircle, Edit2, Calendar, DollarSign, User, MessageCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ChargeDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const chargeId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [charge, setCharge] = useState<any>(null);

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
            }
        } catch (error) {
            console.error('Error fetching charge:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsPaid = async () => {
        if (!confirm('Marcar esta cobrança como paga?')) return;

        setActionLoading(true);
        try {
            const res = await fetch(`/api/charges/${chargeId}/mark-paid`, {
                method: 'POST',
            });

            if (!res.ok) throw new Error('Erro ao marcar como pago');

            await fetchCharge();
            alert('Cobrança marcada como paga!');
        } catch (error) {
            console.error('Error marking as paid:', error);
            alert('Erro ao marcar como pago. Tente novamente.');
        } finally {
            setActionLoading(false);
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

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    const isOverdue = new Date(charge.dueDate) < new Date() && charge.status !== 'PAID';
    const displayStatus = isOverdue ? 'OVERDUE' : charge.status;

    return (
        <div className="max-w-4xl mx-auto">
            <Link
                href="/dashboard"
                className="flex items-center text-slate-500 hover:text-slate-800 mb-6 text-sm"
            >
                <ArrowLeft size={16} className="mr-1" /> Voltar ao dashboard
            </Link>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-8 text-white">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-heading font-bold mb-2">
                                {formatCurrency(Number(charge.amount))}
                            </h1>
                            <p className="text-primary-100">
                                Cobrança para {charge.client.name}
                            </p>
                        </div>
                        <StatusBadge status={displayStatus} />
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {/* Client Info */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">Informações do Cliente</h2>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                                    <User size={20} className="text-primary-600" />
                                </div>
                                <div>
                                    <div className="text-sm text-slate-500">Nome</div>
                                    <div className="font-semibold text-slate-900">{charge.client.name}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <MessageCircle size={20} className="text-green-600" />
                                </div>
                                <div>
                                    <div className="text-sm text-slate-500">WhatsApp</div>
                                    <div className="font-semibold text-slate-900">{charge.client.whatsapp}</div>
                                </div>
                            </div>

                            {charge.client.email && (
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <MessageCircle size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-500">Email</div>
                                        <div className="font-semibold text-slate-900">{charge.client.email}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Charge Info */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">Detalhes da Cobrança</h2>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                    <DollarSign size={20} className="text-amber-600" />
                                </div>
                                <div>
                                    <div className="text-sm text-slate-500">Valor</div>
                                    <div className="font-semibold text-slate-900">{formatCurrency(Number(charge.amount))}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                    <Calendar size={20} className="text-purple-600" />
                                </div>
                                <div>
                                    <div className="text-sm text-slate-500">Vencimento</div>
                                    <div className="font-semibold text-slate-900">
                                        {format(new Date(charge.dueDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                                    <MessageCircle size={20} className="text-slate-600" />
                                </div>
                                <div>
                                    <div className="text-sm text-slate-500">Tom da Mensagem</div>
                                    <div className="font-semibold text-slate-900">
                                        {charge.messageType === 'FRIENDLY' ? 'Amigável 😊' :
                                            charge.messageType === 'NEUTRAL' ? 'Neutro 👋' : 'Profissional 👔'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <Clock size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-sm text-slate-500">Criada em</div>
                                    <div className="font-semibold text-slate-900">
                                        {format(new Date(charge.createdAt), "dd/MM/yyyy 'às' HH:mm")}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-6 border-t border-slate-100">
                        {charge.status !== 'PAID' && (
                            <Button
                                onClick={handleMarkAsPaid}
                                disabled={actionLoading}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {actionLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processando...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Marcar como Pago
                                    </>
                                )}
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            onClick={() => router.push(`/dashboard/charges/${chargeId}/edit`)}
                        >
                            <Edit2 className="mr-2 h-4 w-4" />
                            Editar Cobrança
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.push('/dashboard/charges')}
                        >
                            Ver Todas as Cobranças
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        PENDING: 'bg-yellow-500 text-white',
        SENT: 'bg-blue-500 text-white',
        PAID: 'bg-green-500 text-white',
        OVERDUE: 'bg-red-500 text-white',
        CANCELLED: 'bg-slate-500 text-white',
    };

    const labels = {
        PENDING: 'Pendente',
        SENT: 'Enviada',
        PAID: 'Paga',
        OVERDUE: 'Vencida',
        CANCELLED: 'Cancelada',
    };

    return (
        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${styles[status as keyof typeof styles]}`}>
            {labels[status as keyof typeof labels]}
        </span>
    );
}
