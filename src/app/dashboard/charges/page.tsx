import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Plus, FileText, Calendar, DollarSign } from "lucide-react";

export default async function ChargesPage() {
    const session = await getServerSession(authOptions);
    if (!session) return null;

    // @ts-ignore
    const charges = await prisma.charge.findMany({
        where: { userId: (session.user as any).id },
        include: { client: true },
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    const stats = {
        total: charges.length,
        pending: charges.filter(c => c.status === 'PENDING').length,
        sent: charges.filter(c => c.status === 'SENT').length,
        paid: charges.filter(c => c.status === 'PAID').length,
    };

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
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cliente</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Valor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vencimento</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tom</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Criada em</th>
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
