import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowUpRight, Clock, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id;

    if (!userId) return null;

    // Dates for monthly stats
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fetch data in parallel
    const [
        pendingChargesRaw,
        paidChargesMonthRaw,
        totalCharges,
        paidChargesTotal,
        recentChargesRaw
    ] = await Promise.all([
        // 1. Total pending amount (Pending + Sent = Not Paid)
        prisma.charge.findMany({
            where: {
                userId,
                status: { in: ['PENDING', 'SENT'] }
            },
            select: { amount: true }
        }),
        // 2. Received (from charges created this month)
        prisma.charge.findMany({
            where: {
                userId,
                status: 'PAID',
                createdAt: { gte: firstDayOfMonth }
            },
            select: { amount: true }
        }),
        // 3. Total charges count (for conversion rate)
        prisma.charge.count({ where: { userId } }),
        // 4. Total paid charges count (for conversion rate)
        prisma.charge.count({ where: { userId, status: 'PAID' } }),
        // 5. Recent charges list
        prisma.charge.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { client: true }
        })
    ]);

    // Calculate aggregations
    const totalPendingValue = pendingChargesRaw.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const totalReceivedMonth = paidChargesMonthRaw.reduce((acc, curr) => acc + Number(curr.amount), 0);

    const conversionRate = totalCharges > 0
        ? Math.round((paidChargesTotal / totalCharges) * 100)
        : 0;

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    // Serialize Decimal and Date objects to plain JS for recent charges
    const recentCharges = recentChargesRaw.map(charge => {
        const isOverdue = new Date(charge.dueDate) < new Date() && charge.status !== 'PAID';
        return {
            ...charge,
            amount: Number(charge.amount),
            client: {
                ...charge.client,
                createdAt: charge.client.createdAt.toISOString(),
            },
            dueDate: charge.dueDate.toISOString(),
            createdAt: charge.createdAt.toISOString(),
            // Computed status for UI
            displayStatus: isOverdue ? 'OVERDUE' : charge.status
        };
    });

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-slate-800">Visão Geral</h1>
                    <p className="text-slate-500">Resumo das suas cobranças recentes.</p>
                </div>
                <Link href="/dashboard/charges/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nova Cobrança
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatsCard
                    title="A Receber"
                    value={formatCurrency(totalPendingValue)}
                    subtext={`${pendingChargesRaw.length} cobranças pendentes`}
                    icon={<Clock className="text-amber-500" />}
                    color="bg-amber-50"
                />
                <StatsCard
                    title="Recebido (Mês)"
                    value={formatCurrency(totalReceivedMonth)}
                    subtext="Neste mês atual"
                    icon={<CheckCircle className="text-green-500" />}
                    color="bg-green-50"
                />
                <StatsCard
                    title="Taxa de Pagamento"
                    value={`${conversionRate}%`}
                    subtext="Das cobranças criadas"
                    icon={<ArrowUpRight className="text-blue-500" />}
                    color="bg-blue-50"
                />
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-800">Cobranças Recentes</h2>
                    {recentCharges.length > 0 && (
                        <Link href="/dashboard/charges" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                            Ver todas
                        </Link>
                    )}
                </div>

                {recentCharges.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-3">
                            <Clock size={24} className="text-slate-400" />
                        </div>
                        <p>Você ainda não tem cobranças recentes.</p>
                        <Link href="/dashboard/charges/new" className="text-primary-600 hover:underline mt-2 inline-block">Criar a primeira</Link>
                    </div>
                ) : (
                    <>
                        {/* Mobile View: Card List */}
                        <div className="md:hidden space-y-4">
                            {recentCharges.map((charge) => (
                                <div key={charge.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-bold text-slate-800">{charge.client.name}</div>
                                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                                <Clock size={12} />
                                                Vence em {format(new Date(charge.dueDate), "dd/MM/yyyy")}
                                            </div>
                                        </div>
                                        <StatusBadge status={charge.displayStatus} />
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-slate-100/50">
                                        <span className="font-bold text-slate-800 text-lg">
                                            {formatCurrency(charge.amount)}
                                        </span>
                                        <Link href={`/dashboard/charges/${charge.id}`} className="text-sm font-medium text-primary-600 hover:text-primary-700">
                                            Detalhes
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop View: Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                                        <th className="pb-3 pl-4">Cliente</th>
                                        <th className="pb-3">Valor</th>
                                        <th className="pb-3">Vencimento</th>
                                        <th className="pb-3">Status</th>
                                        <th className="pb-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {recentCharges.map((charge) => (
                                        <tr key={charge.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4 pl-4 font-medium text-slate-800">
                                                {charge.client.name}
                                            </td>
                                            <td className="py-4 text-slate-600">
                                                {formatCurrency(charge.amount)}
                                            </td>
                                            <td className="py-4 text-slate-600">
                                                {format(new Date(charge.dueDate), "dd/MM/yyyy")}
                                            </td>
                                            <td className="py-4">
                                                <StatusBadge status={charge.displayStatus} />
                                            </td>
                                            <td className="py-4 text-right pr-4">
                                                <Link href={`/dashboard/charges/${charge.id}`} className="text-slate-400 hover:text-primary-600 font-medium text-sm">
                                                    Detalhes
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function StatsCard({ title, value, subtext, icon, color }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">{value}</h3>
                <p className="text-xs text-slate-400">{subtext}</p>
            </div>
            <div className={`p-3 rounded-xl ${color}`}>
                {icon}
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        PENDING: "bg-amber-100 text-amber-700",
        SENT: "bg-blue-100 text-blue-700",
        PAID: "bg-green-100 text-green-700",
        OVERDUE: "bg-red-100 text-red-700",
        CANCELLED: "bg-slate-100 text-slate-700"
    };

    const labels = {
        PENDING: "Pendente",
        SENT: "Enviado",
        PAID: "Pago",
        OVERDUE: "Vencido",
        CANCELLED: "Cancelado"
    };

    // @ts-ignore
    const style = styles[status] || styles.PENDING;
    // @ts-ignore
    const label = labels[status] || status;

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${style}`}>
            {label}
        </span>
    );
}
