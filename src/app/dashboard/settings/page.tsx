"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Lock, Bell, Palette } from "lucide-react";

export default function SettingsPage() {
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        // Simulate save
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaving(false);
        alert("Configurações salvas com sucesso!");
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-heading font-bold text-slate-800 mb-8">Configurações</h1>

            <div className="space-y-6">
                {/* Profile Section */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <User size={20} className="text-primary-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Perfil</h2>
                            <p className="text-sm text-slate-500">Gerencie suas informações pessoais</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Input
                            label="Nome Completo"
                            placeholder="Seu nome"
                            defaultValue="Lucas Castro"
                        />
                        <Input
                            label="Email"
                            type="email"
                            placeholder="seu@email.com"
                            defaultValue="lucas@teste.com"
                        />
                    </div>
                </div>

                {/* Security Section */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <Lock size={20} className="text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Segurança</h2>
                            <p className="text-sm text-slate-500">Altere sua senha</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Input
                            label="Senha Atual"
                            type="password"
                            placeholder="••••••••"
                        />
                        <Input
                            label="Nova Senha"
                            type="password"
                            placeholder="••••••••"
                        />
                        <Input
                            label="Confirmar Nova Senha"
                            type="password"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                {/* Notifications Section */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Bell size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Notificações</h2>
                            <p className="text-sm text-slate-500">Gerencie como você recebe notificações</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <NotificationToggle
                            label="Email de cobranças enviadas"
                            description="Receba um email quando uma cobrança for enviada"
                            defaultChecked={true}
                        />
                        <NotificationToggle
                            label="Email de pagamentos recebidos"
                            description="Receba um email quando um pagamento for confirmado"
                            defaultChecked={true}
                        />
                        <NotificationToggle
                            label="Resumo semanal"
                            description="Receba um resumo das suas cobranças toda semana"
                            defaultChecked={false}
                        />
                    </div>
                </div>

                {/* Preferences Section */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <Palette size={20} className="text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Preferências</h2>
                            <p className="text-sm text-slate-500">Personalize sua experiência</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Tom padrão das mensagens
                            </label>
                            <select className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                                <option value="FRIENDLY">Amigável</option>
                                <option value="NEUTRAL">Neutro</option>
                                <option value="PROFESSIONAL">Profissional</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end gap-4">
                    <Button variant="outline">
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

function NotificationToggle({ label, description, defaultChecked }: { label: string; description: string; defaultChecked: boolean }) {
    const [checked, setChecked] = useState(defaultChecked);

    return (
        <div className="flex items-center justify-between py-3">
            <div>
                <div className="text-sm font-medium text-slate-800">{label}</div>
                <div className="text-xs text-slate-500">{description}</div>
            </div>
            <button
                onClick={() => setChecked(!checked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-primary-500' : 'bg-slate-200'
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'
                        }`}
                />
            </button>
        </div>
    );
}
