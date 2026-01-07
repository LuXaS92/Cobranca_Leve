"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Calendar, Edit2, CheckCircle, Loader2, Link as LinkIcon, Copy } from "lucide-react";

export default function ChargesPage() {
    const [charges, setCharges] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchCharges();
    }, []);

    const fetchCharges = async () => {
        try {
            const res = await fetch('/api/charges');
            const data = await res.json();
            setCharges(data);
        } catch (error) {
            console.error('Error fetching charges:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateLink = async (chargeId: string) => {
        setActionLoading(`link-${chargeId}`);
        try {
            const res = await fetch(`/api/charges/${chargeId}/pay`, {
                method: 'POST',
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.error && data.error.includes("Mercado Pago access token")) {
                    alert("Configure seu Token do Mercado Pago em Configurações > Pagamentos");
                    return;
                }
                throw new Error(data.error || 'Erro ao gerar link');
            }

            // Refresh charges to show the link
            await fetchCharges();
            alert('Link de pagamento gerado com sucesso!');
        } catch (error) {
            console.error('Error generating link:', error);
            alert('Erro ao gerar link. Verifique suas configurações.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleCopyLink = (url: string) => {
        navigator.clipboard.writeText(url);
        alert("Link copiado para a área de transferência!");
    };

    const handleMarkAsPaid = async (chargeId: string) => {
        if (!confirm('Marcar esta cobrança como paga?')) return;

        setActionLoading(chargeId);
        try {
            const res = await fetch(`/api/charges/${chargeId}/mark-paid`, {
                method: 'POST',
            });

            if (!res.ok) throw new Error('Erro ao marcar como pago');

            // Refresh charges
            await fetchCharges();
            alert('Cobrança marcada como paga!');
        } catch (error) {
            console.error('Error marking as paid:', error);
            alert('Erro ao marcar como pago. Tente novamente.');
        } finally {
            setActionLoading(null);
        }
    };

    const stats = {
        total: charges.length,
        pending: charges.filter(c => c.status === 'PENDING').length,
        sent: charges.filter(c => c.status === 'SENT').length,
        paid: charges.filter(c => c.status === 'PAID').length,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-heading font-bold text-slate-800">Cobranças</h1>
                <Link href="/dashboard/charges/new" className={buttonVariants()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Cobrança
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total" value={stats.total} color="bg-slate-100 text-slate-700" />
                <StatCard label="Pendentes" value={stats.pending} color="bg-yellow-100 text-yellow-700" />
                <StatCard label="Enviadas" value={stats.sent} color="bg-blue-100 text-blue-700" />
                <StatCard label="Pagas" value={stats.paid} color="bg-green-100 text-green-700" />
            </div>

            {charges.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                        <FileText size={32} className="text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Nenhuma cobrança ainda</h3>
                    <p className="text-slate-500 mb-6">Crie sua primeira cobrança para começar.</p>
                    <Link href="/dashboard/charges/new" className={buttonVariants()}>
                        Criar Cobrança
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    {/* Mobile View: Card List */}
                    <div className="md:hidden divide-y divide-slate-100">
                        {charges.map(charge => (
                            <div key={charge.id} className="p-4 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-bold text-slate-900">{charge.client.name}</div>
                                        <div className="text-xs text-slate-500">{charge.client.whatsapp}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-slate-900 mb-1">
                                            R$ {Number(charge.amount).toFixed(2)}
                                        </div>
                                        <StatusBadge status={charge.status} />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-sm text-slate-500 bg-slate-50 p-2 rounded-lg">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} />
                                        <span>{new Date(charge.dueDate).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                        <span className="text-xs">
                                            {charge.messageType === 'FRIENDLY' ? 'Amigável' :
                                                charge.messageType === 'NEUTRAL' ? 'Neutro' : 'Profissional'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-1">
                                    {charge.status !== 'PAID' && (
                                        <>
                                            {charge.paymentUrl ? (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleCopyLink(charge.paymentUrl)}
                                                    className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                >
                                                    <Copy className="h-4 w-4 mr-1.5" />
                                                    Link
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleGenerateLink(charge.id)}
                                                    disabled={actionLoading === `link-${charge.id}`}
                                                    className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                >
                                                    {actionLoading === `link-${charge.id}` ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <LinkIcon className="h-4 w-4 mr-1.5" />
                                                            Link
                                                        </>
                                                    )}
                                                </Button>
                                            )}

                                            <Button
                                                size="sm"
                                                onClick={() => handleMarkAsPaid(charge.id)}
                                                disabled={actionLoading === charge.id}
                                                className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-transparent shadow-none"
                                            >
                                                {actionLoading === charge.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <CheckCircle className="h-4 w-4 mr-1.5" />
                                                        Pago
                                                    </>
                                                )}
                                            </Button>
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center justify-between mt-0 pt-0">
                                    <Link
                                        href={`/dashboard/charges/${charge.id}/edit`}
                                        className={`w-full ${buttonVariants({ size: 'sm', variant: 'outline' })}`}
                                    >
                                        <Edit2 className="h-4 w-4 mr-1.5" />
                                        Editar
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop View: Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cliente</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Valor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vencimento</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tom</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Criada em</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {charges.map(charge => (
                                    <tr key={charge.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-900">{charge.client.name}</div>
                                            <div className="text-sm text-slate-500">{charge.client.whatsapp}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-slate-900">
                                                R$ {Number(charge.amount).toFixed(2)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-slate-600">
                                                <Calendar size={14} className="mr-1" />
                                                {new Date(charge.dueDate).toLocaleDateString('pt-BR')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                                                {charge.messageType === 'FRIENDLY' ? 'Amigável' :
                                                    charge.messageType === 'NEUTRAL' ? 'Neutro' : 'Profissional'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={charge.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {new Date(charge.createdAt).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                {charge.status !== 'PAID' && (
                                                    <>
                                                        {charge.paymentUrl ? (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleCopyLink(charge.paymentUrl)}
                                                                title="Copiar Link de Pagamento"
                                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                            >
                                                                <Copy className="h-4 w-4" />
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleGenerateLink(charge.id)}
                                                                disabled={actionLoading === `link-${charge.id}`}
                                                                title="Gerar Link de Pagamento"
                                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                            >
                                                                {actionLoading === `link-${charge.id}` ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <LinkIcon className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        )}

                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleMarkAsPaid(charge.id)}
                                                            disabled={actionLoading === charge.id}
                                                            title="Marcar como Pago"
                                                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        >
                                                            {actionLoading === charge.id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <CheckCircle className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </>
                                                )}
                                                <Link
                                                    href={`/dashboard/charges/${charge.id}/edit`}
                                                    className={buttonVariants({ size: 'sm', variant: 'ghost' })}
                                                    title="Editar"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className={`p-4 rounded-xl ${color}`}>
            <div className="text-sm font-medium opacity-80">{label}</div>
            <div className="text-2xl font-bold mt-1">{value}</div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        PENDING: 'bg-yellow-100 text-yellow-700',
        SENT: 'bg-blue-100 text-blue-700',
        PAID: 'bg-green-100 text-green-700',
        CANCELLED: 'bg-red-100 text-red-700',
    };

    const labels = {
        PENDING: 'Pendente',
        SENT: 'Enviada',
        PAID: 'Paga',
        CANCELLED: 'Cancelada',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
            {labels[status as keyof typeof labels]}
        </span>
    );
}
