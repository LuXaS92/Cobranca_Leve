"use client"

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function UserNav() {
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Helper to get initials
    const getInitials = (name: string) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    };

    // Cast session user to include image if TS complains, though we updated schema.
    // NextAuth session type might need extension in `types/next-auth.d.ts` but for now we look at `session.user` as any or just access properties.
    const user = session?.user as any;

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 group focus:outline-none"
            >
                <div className={cn(
                    "w-9 h-9 rounded-full bg-gradient-to-tr from-primary-400 to-secondary-500 border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-xs overflow-hidden transition-transform group-hover:scale-105",
                    open && "ring-2 ring-primary-200"
                )}>
                    {user.image ? (
                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        getInitials(user.name)
                    )}
                </div>
                <div className="hidden md:block text-left">
                    <p className="text-sm font-bold text-slate-700 leading-none">{user.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Editar Perfil</p>
                </div>
                <ChevronDown size={14} className="text-slate-400 hidden md:block" />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="px-4 py-2 border-b border-slate-50 md:hidden">
                        <p className="text-sm font-bold text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <div className="p-1">
                        <Link
                            href="/dashboard/settings"
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary-600 rounded-lg transition-colors"
                            onClick={() => setOpen(false)}
                        >
                            <User size={16} />
                            Meu Perfil
                        </Link>
                        <Link
                            href="/dashboard/settings"
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary-600 rounded-lg transition-colors"
                            onClick={() => setOpen(false)}
                        >
                            <Settings size={16} />
                            Configurações
                        </Link>
                    </div>

                    <div className="border-t border-slate-50 my-1"></div>

                    <div className="p-1">
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut size={16} />
                            Sair
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
