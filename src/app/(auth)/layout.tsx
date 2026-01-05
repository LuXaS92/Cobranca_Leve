export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
            <div className="hidden lg:flex flex-col justify-center items-center bg-primary-600 p-12 text-white relative overflow-hidden">
                {/* Abstract shapes/decoration */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-white blur-3xl"></div>
                    <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-primary-300 blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-lg text-center">
                    <div className="mb-8 flex justify-center">
                        {/* Logo Icon Large */}
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-4xl font-heading font-bold mb-4">Cobrança Leve</h1>
                    <p className="text-primary-100 text-lg">
                        Gerencie suas cobranças com empatia, profissionalismo e zero estresse. Deixe a parte chata com a gente.
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center p-8 sm:p-12 lg:p-16">
                <div className="w-full max-w-md space-y-8">
                    {children}
                </div>
            </div>
        </div>
    )
}
