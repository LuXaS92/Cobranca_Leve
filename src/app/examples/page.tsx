"use client"

import { useState } from "react"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Zap, Check, Clock, ShieldCheck, Mail, MessageCircle } from "lucide-react"

// --- Constants ---

const TEMPLATES = {
    FRIENDLY: {
        id: "FRIENDLY",
        emoji: "😊",
        title: "Amigável",
        description: "Ideal para manter o relacionamento próximo.",
        color: "bg-green-100 text-green-700 hover:bg-green-200",
        borderColor: "border-green-200",
        message: "Oi Lucas, tudo bem? 😊\n\nPassando só para lembrar do pagamento de R$ 150,00 combinado.\n\nSe já tiver feito, por favor desconsidere! Qualquer dúvida estou à disposição."
    },
    NEUTRAL: {
        id: "NEUTRAL",
        emoji: "👋",
        title: "Neutro",
        description: "Direto e educado, sem excessos.",
        color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
        borderColor: "border-blue-200",
        message: "Olá Lucas, espero que esteja bem.\n\nEste é um lembrete sobre o pagamento pendente no valor de R$ 150,00.\n\nCaso já tenha realizado a transferência, por favor envie o comprovante. Obrigado!"
    },
    PROFESSIONAL: {
        id: "PROFESSIONAL",
        emoji: "👔",
        title: "Profissional",
        description: "Formal, para relações estritamente comerciais.",
        color: "bg-slate-100 text-slate-700 hover:bg-slate-200",
        borderColor: "border-slate-200",
        message: "Prezado(a) Lucas,\n\nInformamos que o pagamento no valor de R$ 150,00 encontra-se em aberto.\n\nSolicitamos que regularize a pendência ou entre em contato caso haja alguma divergência.\n\nAtenciosamente."
    }
} as const;

// --- Page Component ---

export default function ExamplesPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navbar */}
            <header className="bg-white border-b border-slate-100">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
                        <ArrowLeft size={18} />
                        <span className="font-medium">Voltar para home</span>
                    </Link>
                    <Link href="/register" className={buttonVariants({ size: 'sm' })}>
                        Começar Grátis
                    </Link>
                </div>
            </header>

            <main className="py-12 md:py-20">
                {/* Hero */}
                <div className="container mx-auto px-4 text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold uppercase tracking-wide mb-6">
                        <Zap size={14} />
                        Veja como funciona
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6">
                        Cobre sem <span className="text-primary-500">parecer cobrança</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Veja na prática como nossas mensagens se adaptam ao seu estilo e como a automação trabalha para você.
                    </p>
                </div>

                {/* Interactive Simulator */}
                <section className="container mx-auto px-4 mb-32">
                    <div className="max-w-5xl mx-auto">
                        <ToneSimulator />
                    </div>
                </section>

                {/* Timeline Section */}
                <section className="bg-white border-y border-slate-100 py-20 mb-20">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-4">
                                Você cria uma vez, nós fazemos o resto
                            </h2>
                            <p className="text-slate-600">
                                Entenda o ciclo de vida de uma cobrança automática.
                            </p>
                        </div>
                        <AutomationTimeline />
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4 text-center pb-12">
                    <div className="bg-primary-900 rounded-3xl p-8 md:p-16 text-white relative overflow-hidden">
                        {/* Abstract Shapes */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-20 -mb-20 blur-3xl" />

                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                                Pronto para profissionalizar suas cobranças?
                            </h2>
                            <p className="text-primary-100 mb-8 text-lg">
                                Junte-se a centenas de profissionais que já recuperaram seu tempo e dinheiro com o Cobrança Leve.
                            </p>
                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center rounded-xl text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-white text-primary-900 shadow hover:bg-slate-100 h-14 px-8 py-2 w-full sm:w-auto"
                            >
                                Começar Gratuitamente
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <p className="mt-6 text-sm text-primary-200">
                                Sem cartão de crédito • 3 cobranças grátis/mês
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

// --- Interactive Components ---

function ToneSimulator() {
    const [activeTone, setActiveTone] = useState<keyof typeof TEMPLATES>("FRIENDLY");
    const template = TEMPLATES[activeTone];

    return (
        <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Controls */}
            <div className="order-2 md:order-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                    Escolha o tom ideal para cada cliente
                </h3>
                <p className="text-slate-600 mb-8">
                    Nem todo cliente é igual. Por isso, oferecemos opções que vão do "amigo próximo" ao "cliente corporativo".
                </p>

                <div className="space-y-4">
                    {(Object.keys(TEMPLATES) as Array<keyof typeof TEMPLATES>).map((key) => {
                        const t = TEMPLATES[key];
                        const isActive = activeTone === key;

                        return (
                            <button
                                key={key}
                                onClick={() => setActiveTone(key)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 group ${isActive
                                        ? `border-primary-500 bg-white shadow-md scale-[1.02]`
                                        : "border-transparent bg-white hover:bg-slate-50 hover:border-slate-200"
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-colors ${isActive ? "bg-primary-100" : "bg-slate-100 group-hover:bg-slate-200"
                                    }`}>
                                    {t.emoji}
                                </div>
                                <div>
                                    <div className={`font-bold ${isActive ? "text-primary-700" : "text-slate-700"}`}>
                                        {t.title}
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        {t.description}
                                    </div>
                                </div>
                                {isActive && (
                                    <div className="ml-auto text-primary-500">
                                        <Check size={20} strokeWidth={3} />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Phone Mockup */}
            <div className="order-1 md:order-2 flex justify-center">
                <div className="relative w-[320px] h-[640px] bg-slate-900 rounded-[3rem] shadow-2xl p-3 border-4 border-slate-800 ring-1 ring-slate-950/5">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-40 bg-slate-800 rounded-b-2xl z-20"></div>

                    {/* Screen */}
                    <div className="w-full h-full bg-[#e5ddd5] rounded-[2.2rem] overflow-hidden flex flex-col relative">
                        {/* Header */}
                        <div className="bg-[#075e54] h-20 pt-8 px-4 flex items-center gap-3 text-white shadow-sm z-10">
                            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 text-xs">U</div>
                            <div>
                                <div className="font-semibold text-sm">Lucas</div>
                                <div className="text-[10px] opacity-80">visto por último hoje às 09:45</div>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 p-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-opacity-10 bg-repeat flex flex-col justify-end pb-6">

                            {/* Previous Message (Context) */}
                            <div className="bg-[#dcf8c6] self-end p-2 px-3 rounded-lg rounded-tr-none shadow-sm max-w-[85%] mb-4 text-xs text-slate-800">
                                <span>Oi Lucas, pode deixar! Te aviso.</span>
                                <div className="text-[9px] text-slate-500 text-right mt-1 flex justify-end items-center gap-0.5">
                                    09:15 <span className="text-blue-400">✓✓</span>
                                </div>
                            </div>

                            {/* Dynamic Message */}
                            <div key={activeTone} className="animate-in slide-in-from-bottom-2 fade-in duration-300">
                                <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[90%] text-sm text-slate-800 whitespace-pre-wrap relative">
                                    {template.message}
                                    <div className="text-[10px] text-slate-400 text-right mt-1 flex justify-end items-center gap-1">
                                        10:00 <span className="text-slate-400">✓</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Input */}
                        <div className="h-12 bg-[#f0f2f5] px-2 flex items-center gap-2">
                            <div className="flex-1 bg-white h-9 rounded-full px-4 text-slate-400 text-sm flex items-center">
                                Mensagem
                            </div>
                            <div className="w-9 h-9 bg-[#00897b] rounded-full flex items-center justify-center text-white shadow-sm">
                                <MessageCircle size={16} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AutomationTimeline() {
    const steps = [
        {
            day: "Dia 0",
            title: "Você cria a cobrança",
            desc: "Cadastre o cliente e a data. É a única coisa que você faz.",
            icon: <Check size={20} className="text-white" />,
            color: "bg-slate-900",
            side: "left"
        },
        {
            day: "3 dias antes",
            title: "Lembrete Amigável",
            desc: "O sistema envia um 'Oi, tudo bem?' suave para lembrar.",
            icon: <Clock size={20} className="text-white" />,
            color: "bg-green-500",
            badge: "Automático",
            side: "right"
        },
        {
            day: "Dia do Vencimento",
            title: "Cobrança Direta",
            desc: "No dia D, enviamos a fatura e as instruções de pagamento.",
            icon: <Zap size={20} className="text-white" />,
            color: "bg-blue-500",
            badge: "Automático",
            side: "left"
        },
        {
            day: "3 dias depois",
            title: "Recuperação",
            desc: "Se não pagou, enviamos um lembrete mais firme, porém educado.",
            icon: <ShieldCheck size={20} className="text-white" />,
            color: "bg-amber-500",
            badge: "Automático",
            side: "right"
        }
    ];

    return (
        <div className="relative max-w-3xl mx-auto">
            {/* Center Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 md:-ml-[1px]" />

            <div className="space-y-12">
                {steps.map((step, idx) => (
                    <div key={idx} className={`relative flex flex-col md:flex-row gap-8 md:gap-0 ${step.side === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'
                        }`}>
                        {/* Timeline Dot (Mobile: Left, Desktop: Center) */}
                        <div className="absolute left-4 md:left-1/2 -translate-x-[9px] md:-translate-x-1/2 w-5 h-5 rounded-full border-4 border-white shadow-sm z-10 bg-slate-300" />

                        {/* Content Card */}
                        <div className={`pl-12 md:pl-0 md:w-1/2 ${step.side === 'left' ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'
                            }`}>
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                {step.badge && (
                                    <div className={`absolute top-4 ${step.side === 'left' ? 'md:left-4 right-4' : 'right-4'} px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500`}>
                                        {step.badge}
                                    </div>
                                )}

                                <div className={`flex items-center gap-3 mb-3 ${step.side === 'left' ? 'md:flex-row-reverse' : 'flex-row'
                                    }`}>
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${step.color}`}>
                                        {step.icon}
                                    </div>
                                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest font-heading">
                                        {step.day}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-slate-800 mb-2">{step.title}</h3>
                                <p className="text-slate-600">{step.desc}</p>
                            </div>
                        </div>

                        {/* Empty Space for other side */}
                        <div className="md:w-1/2" />
                    </div>
                ))}
            </div>
        </div>
    );
}
