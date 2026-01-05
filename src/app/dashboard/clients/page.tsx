import { prisma } from "@/lib/prisma"; // Direct DB access in Server Component
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus, User, MessageCircle } from "lucide-react";

export default async function ClientsPage() {
    const session = await getServerSession(authOptions);
    if (!session) return null;

    // @ts-ignore
    const clients = await prisma.client.findMany({
        where: { userId: (session.user as any).id },
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { charges: true } } }
    });

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-heading font-bold text-slate-800">Meus Clientes</h1>
                <Link href="/dashboard/clients/new" className={buttonVariants()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Cliente
                </Link>
            </div>

            {clients.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                        <User size={32} className="text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Nenhum cliente ainda</h3>
                    <p className="text-slate-500 mb-6">Cadastre seu primeiro cliente para começar a cobrar.</p>
                    <Link href="/dashboard/clients/new" className={buttonVariants()}>
                        Cadastrar Cliente
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {clients.map(client => (
                        <div key={client.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-lg">
                                    {client.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="bg-slate-50 px-2 py-1 rounded text-xs font-medium text-slate-500">
                                    {client._count.charges} cobranças
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">{client.name}</h3>
                            <div className="text-sm text-slate-500 space-y-1 mb-4">
                                <p className="flex items-center gap-2">
                                    <MessageCircle size={14} className="text-green-500" />
                                    {client.whatsapp}
                                </p>
                                {client.email && <p className="ml-6">{client.email}</p>}
                            </div>
                            <div className="flex gap-2">
                                <Link href={`/dashboard/charges/new?client=${client.id}`} className={buttonVariants({ variant: "secondary", size: "sm", fullWidth: true, className: "flex-1" })}>
                                    Nova Cobrança
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
