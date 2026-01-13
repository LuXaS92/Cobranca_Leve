"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    CreditCard
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { UserNav } from "@/components/layout/UserNav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed lg:static inset-y-0 left-0 z-30 w-64 sidebar-dark border-r border-white/50 shadow-xl transform transition-transform duration-200 ease-in-out lg:translate-x-0 flex flex-col backdrop-blur-md",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-16 flex items-center px-6 border-b border-gray-100/50">
                    <Link href="/dashboard" className="flex items-center gap-2 font-heading font-bold text-xl gradient-text">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white text-sm shadow-lg">
                            CL
                        </div>
                        Cobrança Leve
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="ml-auto lg:hidden text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1">
                    <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />} label="Visão Geral" />
                    <NavItem href="/dashboard/clients" icon={<Users size={20} />} label="Clientes" />
                    <NavItem href="/dashboard/charges" icon={<FileText size={20} />} label="Cobranças" />
                    <NavItem href="/dashboard/subscription" icon={<CreditCard size={20} />} label="Minha Assinatura" />
                    <NavItem href="/dashboard/settings" icon={<Settings size={20} />} label="Configurações" />
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex w-full items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                        <LogOut size={20} />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white/50 backdrop-blur-md border-b border-white/50 flex items-center justify-between px-4 lg:px-8 shadow-sm relative z-20">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-gray-600"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="ml-auto flex items-center gap-4">
                        <UserNav />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    const pathname = usePathname();
    const isActive = pathname === href || pathname.startsWith(`${href}/`);

    // Special check for dashboard root to avoid highlighting on all subpaths
    const isExactActive = href === "/dashboard" ? pathname === "/dashboard" : isActive;

    return (
        <Link
            href={href}
            className={cn(
                "sidebar-nav-item flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all mx-2 mb-1",
                isExactActive
                    ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/30 active"
                    : "text-slate-600 hover:bg-slate-100/50 hover:text-primary-600"
            )}
        >
            {icon}
            {label}
        </Link>
    );
}
