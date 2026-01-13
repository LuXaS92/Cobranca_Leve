"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User, Lock, Bell, Loader2, Save, Wallet } from "lucide-react";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
    const { update } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form States
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [mpAccessToken, setMpAccessToken] = useState("");
    const [paymentInfo, setPaymentInfo] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/user/profile');
            const data = await res.json();
            if (data) {
                setName(data.name || "");
                setEmail(data.email || "");
                setMpAccessToken(data.mpAccessToken || "");
                setPaymentInfo(data.paymentInfo || "");
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Validate password change
            if (newPassword) {
                if (newPassword !== confirmPassword) {
                    alert('As senhas não conferem');
                    setSaving(false);
                    return;
                }
                if (!currentPassword) {
                    alert('Digite sua senha atual para alterar a senha');
                    setSaving(false);
                    return;
                }
            }

            const body: any = { name, email, mpAccessToken, paymentInfo };
            if (newPassword) {
                body.currentPassword = currentPassword;
                body.newPassword = newPassword;
            }

            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao atualizar');
            }

            // Update session
            await update({ name: data.name, email: data.email });

            alert("Configurações salvas com sucesso!");

            // Clear password fields
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (error: any) {
            console.error('Error saving profile:', error);
            alert(error.message || "Erro ao salvar configurações");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-heading font-bold text-slate-800 mb-8">Configurações</h1>

            <div className="space-y-6">
                {/* Profile Section */}
                <div className="clean-card p-6">
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
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Nome Completo</label>
                            <input
                                className="clean-input w-full"
                                placeholder="Seu nome"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                            <input
                                className="clean-input w-full"
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="clean-card p-6">
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
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Senha Atual</label>
                            <input
                                className="clean-input w-full"
                                type="password"
                                placeholder="••••••••"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Nova Senha</label>
                            <input
                                className="clean-input w-full"
                                type="password"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Confirmar Nova Senha</label>
                            <input
                                className="clean-input w-full"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Integrations Section */}
                <div className="clean-card p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Wallet size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Pagamentos</h2>
                            <p className="text-sm text-slate-500">Integração com Mercado Pago</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Access Token (Mercado Pago)</label>
                            <input
                                className="clean-input w-full font-mono text-sm"
                                type="password"
                                placeholder="TEST-1234..."
                                value={mpAccessToken}
                                onChange={(e) => setMpAccessToken(e.target.value)}
                            />
                            <p className="text-xs text-slate-500 mt-2">
                                Encontre suas credenciais no painel do Mercado Pago Developers.
                            </p>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Informações Manuais de Pagamento
                            </label>
                            <p className="text-xs text-slate-500 mb-2">
                                Estas informações serão enviadas junto com os lembretes de cobrança. Ótimo para enviar sua chave PIX ou dados bancários.
                            </p>
                            <textarea
                                className="clean-input w-full min-h-[100px]"
                                placeholder={`Exemplo:\nChave PIX: 123.456.789-00\nBanco: Nubank\nAg: 0001 cc: 123456-7`}
                                value={paymentInfo}
                                onChange={(e) => setPaymentInfo(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Notifications Section - Visual Only for MVP */}
                <div className="clean-card p-6 opacity-60 pointer-events-none grayscale">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Bell size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Notificações (Em breve)</h2>
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
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end gap-4 pb-10">
                    <Button variant="outline" onClick={() => fetchProfile()}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={saving} className="btn-primary">
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Salvar Alterações
                            </>
                        )}
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
