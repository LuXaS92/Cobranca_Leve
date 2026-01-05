import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowUpRight, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
// Mock data or server component fetching would go here. For now, static UI.

export default function DashboardPage() {
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
                    value="R$ 1.250,00"
                    subtext="3 cobranças pendentes"
                    icon={<Clock className="text-amber-500" />}
                    color="bg-amber-50"
                />
                <StatsCard
                    title="Recebido (Mês)"
                    value="R$ 3.400,00"
                    subtext="+15% que mês anterior"
                    icon={<CheckCircle className="text-green-500" />}
                    color="bg-green-50"
                />
                <StatsCard
                    title="Taxa de Conversão"
                    value="92%"
                    subtext="Ótima performance"
                    icon={<ArrowUpRight className="text-blue-500" />}
                    color="bg-blue-50"
                />
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Cobranças Recentes</h2>
                <div className="text-center py-12 text-slate-500">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-3">
                        <Clock size={24} className="text-slate-400" />
                    </div>
                    <p>Você ainda não tem cobranças recentes.</p>
                    <Link href="/dashboard/charges/new" className="text-primary-600 hover:underline mt-2 inline-block">Criar a primeira</Link>
                </div>
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
