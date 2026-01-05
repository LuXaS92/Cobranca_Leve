"use client"

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, Send, Copy, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Mock templates (in real app, fetch from DB or config)
const TEMPLATES = {
    FRIENDLY: {
        emoji: "😊",
        title: "Amigável",
        color: "bg-green-100 text-green-700",
        text: (name: string, value: string) =>
            `Oi ${name}, tudo bem? 😊\n\nPassando só para lembrar do pagamento de ${value} combinado.\n\nSe já tiver feito, por favor desconsidere! Qualquer dúvida estou à disposição.`
    },
    NEUTRAL: {
        emoji: "👋",
        title: "Neutro",
        color: "bg-blue-100 text-blue-700",
        text: (name: string, value: string) =>
            `Olá ${name}, espero que esteja bem.\n\nEste é um lembrete sobre o pagamento pendente no valor de ${value}.\n\nCaso já tenha realizado a transferência, por favor envie o comprovante. Obrigado!`
    },
    PROFESSIONAL: {
        emoji: "👔",
        title: "Profissional",
        color: "bg-slate-100 text-slate-700",
        text: (name: string, value: string) =>
            `Prezado(a) ${name},\n\nInformamos que o pagamento no valor de ${value} encontra-se em aberto.\n\nSolicitamos que regularize a pendência ou entre em contato caso haja alguma divergência.\n\nAtenciosamente.`
    }
};

export default function NewChargePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preSelectedClient = searchParams.get("client");

    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState<any[]>([]);

    // Form State
    const [selectedClientId, setSelectedClientId] = useState(preSelectedClient || "");
    const [amount, setAmount] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [tone, setTone] = useState<"FRIENDLY" | "NEUTRAL" | "PROFESSIONAL">("FRIENDLY");
    const [message, setMessage] = useState("");

    // Fetch Clients
    useEffect(() => {
        fetch("/api/clients")
            .then(res => res.json())
            .then(data => setClients(data))
            .catch(err => console.error(err));
    }, []);

    // Update Message Preview
    useEffect(() => {
        const client = clients.find(c => c.id === selectedClientId);
        const clientName = client ? client.name.split(" ")[0] : "[Nome do Cliente]";
        const formattedAmount = amount ? `R$ ${amount}` : "R$ 0,00";

        setMessage(TEMPLATES[tone].text(clientName, formattedAmount));
    }, [tone, selectedClientId, amount, clients]);

    const handleSend = async (method: "WHATSAPP" | "EMAIL") => {
        if (!selectedClientId || !amount) return;

        const client = clients.find(c => c.id === selectedClientId);

        if (method === "WHATSAPP") {
            if (client) {
                const encoded = encodeURIComponent(message);
                window.open(`https://wa.me/55${client.whatsapp}?text=${encoded}`, "_blank");
            }
        } else if (method === "EMAIL") {
            if (!client?.email) {
                alert("Este cliente não possui email cadastrado.");
                return;
            }

            setLoading(true);
            try {
                const res = await fetch("/api/email/send", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        clientId: client.id,
                        amount,
                        dueDate,
                        messageHtml: message.replace(/\n/g, '<br>'),
                        subject: `Lembrete de Pagamento - ${TEMPLATES[tone].title}`
                    })
                });

                if (!res.ok) throw new Error("Erro ao enviar email");

                alert("Email enviado com sucesso!");
            } catch (e) {
                alert("Erro ao enviar email. Tente novamente.");
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto h-[calc(100vh-100px)]">
            <Link href="/dashboard" className="flex items-center text-slate-500 hover:text-slate-800 mb-6 text-sm">
                <ArrowLeft size={16} className="mr-1" /> Voltar ao painel
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                {/* Form Section */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm overflow-y-auto">
                    <h1 className="text-2xl font-bold text-slate-800 mb-6">Nova Cobrança</h1>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Cliente</label>
                            <select
                                className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                value={selectedClientId}
                                onChange={(e) => setSelectedClientId(e.target.value)}
                            >
                                <option value="">Selecione um cliente...</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>{client.name}</option>
                                ))}
                            </select>
                            <div className="mt-1 text-right">
                                <Link href="/dashboard/clients/new" className="text-xs text-primary-600 hover:underline">+ Criar novo cliente</Link>
                            </div>
                        </div>

                        <Input
                            label="Valor (R$)"
                            placeholder="0,00"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />

                        <Input
                            label="Data de Vencimento"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-3">Tom da Mensagem</label>
                            <div className="grid grid-cols-3 gap-3">
                                {Object.entries(TEMPLATES).map(([key, template]) => (
                                    <button
                                        key={key}
                                        onClick={() => setTone(key as any)}
                                        className={cn(
                                            "p-3 rounded-xl border text-left transition-all relative overflow-hidden",
                                            tone === key
                                                ? "border-primary-500 bg-primary-50 ring-1 ring-primary-500"
                                                : "border-slate-200 hover:bg-slate-50"
                                        )}
                                    >
                                        <div className="text-xl mb-1">{template.emoji}</div>
                                        <div className="font-semibold text-sm text-slate-800">{template.title}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="flex flex-col h-full">
                    <div className="bg-slate-800 rounded-[2.5rem] p-4 flex-1 shadow-2xl relative border-8 border-slate-900 overflow-hidden max-h-[700px]">
                        {/* Phone Mockup Header */}
                        <div className="absolute top-0 left-0 w-full h-8 bg-slate-900 z-10 flex justify-center">
                            <div className="w-32 h-5 bg-black rounded-b-xl"></div>
                        </div>

                        <div className="bg-[#e5ddd5] w-full h-full rounded-2xl overflow-hidden flex flex-col relative">
                            {/* WhatsApp Header */}
                            <div className="bg-[#008069] p-3 pt-10 flex items-center gap-3 text-white shadow-sm">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                    <User size={16} />
                                </div>
                                <div className="text-sm font-semibold">
                                    {clients.find(c => c.id === selectedClientId)?.name || "Cliente"}
                                </div>
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 p-4 overflow-y-auto bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-opacity-10 bg-repeat">
                                <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] text-sm text-slate-800 whitespace-pre-wrap relative">
                                    {message}
                                    <div className="text-[10px] text-slate-400 text-right mt-1 flex justify-end items-center gap-1">
                                        10:42 <span className="text-blue-400">✓✓</span>
                                    </div>
                                </div>
                            </div>

                            {/* Phone Footer */}
                            <div className="bg-[#f0f2f5] p-2 flex items-center gap-2">
                                <div className="flex-1 bg-white h-9 rounded-full px-4 text-sm flex items-center text-slate-400">
                                    Mensagem
                                </div>
                                <div className="w-10 h-10 bg-[#008069] rounded-full flex items-center justify-center text-white">
                                    <Send size={18} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-4">
                        <Button
                            fullWidth
                            size="lg"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleSend("WHATSAPP")}
                        >
                            <Send className="mr-2 h-5 w-5" />
                            Enviar no WhatsApp
                        </Button>
                        <Button
                            fullWidth
                            size="lg"
                            variant="secondary"
                            className="bg-sky-600 hover:bg-sky-700 text-white"
                            onClick={() => handleSend("EMAIL")}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 h-5 w-5" />}
                            Enviar por Email
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
