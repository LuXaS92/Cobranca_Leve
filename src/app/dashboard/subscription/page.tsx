import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Check, Zap, Crown } from "lucide-react";

export default async function SubscriptionPage() {
    const session = await getServerSession(authOptions);
    if (!session) return null;

    // @ts-ignore
    const userId = (session.user as any).id;

    // Fetch user's subscription
    const subscription = await prisma.subscription.findFirst({
        where: { userId },
        orderBy: { startedAt: 'desc' }
    });

    // Count charges created this month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const chargesThisMonth = await prisma.charge.count({
        where: {
            userId,
            createdAt: {
                gte: firstDayOfMonth
            }
        }
    });

    const isFree = subscription?.plan === 'FREE';
    const chargesLimit = isFree ? 3 : 999999; // Pro = unlimited

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-heading font-bold text-slate-800 mb-8">Minha Assinatura</h1>

            {/* Current Plan */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Plano Atual</h2>
                        <p className="text-slate-500 text-sm">
                            {isFree ? 'Plano Gratuito' : 'Plano Pro'}
                        </p>
                    </div>
                    <div className={`px-4 py-2 rounded-full ${isFree ? 'bg-slate-100 text-slate-700' : 'bg-primary-100 text-primary-700'}`}>
                        {isFree ? <Zap size={20} /> : <Crown size={20} />}
                    </div>
                </div>

                {isFree && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
                        <p className="text-sm text-yellow-800">
                            <strong>Uso este mês:</strong> {chargesThisMonth} de {chargesLimit} cobranças
                        </p>
                        <div className="w-full bg-yellow-200 rounded-full h-2 mt-2">
                            <div
                                className="bg-yellow-500 h-2 rounded-full transition-all"
                                style={{ width: `${Math.min((chargesThisMonth / chargesLimit) * 100, 100)}%` }}
                            />
                        </div>
                        {chargesThisMonth >= chargesLimit && (
                            <p className="text-sm text-red-600 mt-2 font-semibold">
                                ⚠️ Você atingiu o limite do plano gratuito. Faça upgrade para continuar criando cobranças!
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Plans */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Free Plan */}
                <div className={`bg-white rounded-2xl border-2 p-6 ${isFree ? 'border-primary-500' : 'border-slate-100'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-slate-800">Gratuito</h3>
                        {isFree && (
                            <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                                Atual
                            </span>
                        )}
                    </div>
                    <div className="mb-6">
                        <span className="text-3xl font-bold text-slate-900">R$ 0</span>
                        <span className="text-slate-500">/mês</span>
                    </div>
                    <ul className="space-y-3 mb-6">
                        <Feature text="3 cobranças por mês" />
                        <Feature text="Mensagens empáticas" />
                        <Feature text="Envio por WhatsApp" />
                        <Feature text="Envio por Email" />
                    </ul>
                    {isFree ? (
                        <Button variant="outline" fullWidth disabled>
                            Plano Atual
                        </Button>
                    ) : (
                        <Button variant="outline" fullWidth>
                            Voltar para Gratuito
                        </Button>
                    )}
                </div>

                {/* Pro Plan */}
                <div className={`bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl border-2 p-6 text-white relative overflow-hidden ${!isFree ? 'border-primary-400' : 'border-transparent'}`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">Pro</h3>
                            {!isFree && (
                                <span className="px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full">
                                    Atual
                                </span>
                            )}
                        </div>
                        <div className="mb-6">
                            <span className="text-3xl font-bold">R$ 29,90</span>
                            <span className="text-white/80">/mês</span>
                        </div>
                        <ul className="space-y-3 mb-6">
                            <Feature text="Cobranças ilimitadas" light />
                            <Feature text="Mensagens empáticas" light />
                            <Feature text="Envio por WhatsApp" light />
                            <Feature text="Envio por Email" light />
                            <Feature text="Agendamento automático" light />
                            <Feature text="Relatórios avançados" light />
                            <Feature text="Suporte prioritário" light />
                        </ul>
                        {!isFree ? (
                            <Button variant="secondary" fullWidth className="bg-white text-primary-600 hover:bg-white/90">
                                Gerenciar Assinatura
                            </Button>
                        ) : (
                            <Button variant="secondary" fullWidth className="bg-white text-primary-600 hover:bg-white/90">
                                Fazer Upgrade
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <p className="text-sm text-blue-800">
                    💡 <strong>Em breve:</strong> Integração com Stripe e Mercado Pago para pagamentos automáticos.
                </p>
            </div>
        </div>
    );
}

function Feature({ text, light = false }: { text: string; light?: boolean }) {
    return (
        <li className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${light ? 'bg-white/20' : 'bg-green-100'}`}>
                <Check size={14} className={light ? 'text-white' : 'text-green-600'} />
            </div>
            <span className={`text-sm ${light ? 'text-white/90' : 'text-slate-700'}`}>{text}</span>
        </li>
    );
}
