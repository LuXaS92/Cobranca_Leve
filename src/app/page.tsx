import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Heart, ShieldCheck, Zap, ArrowRight, MessageCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-white/30 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white shadow-lg">
              <Heart size={18} fill="currentColor" />
            </div>
            <span className="font-heading font-bold text-xl gradient-text">
              Cobrança Leve
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-primary-700 hover:text-primary-900 hidden sm:block">
              Entrar
            </Link>
            <Link href="/register" className={buttonVariants({ variant: 'primary', size: 'sm' })}>
              Começar Grátis
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-24 pb-12">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-24 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-sm border border-primary-100 text-primary-700 text-xs font-bold uppercase tracking-wide mb-6 shadow-sm animate-[float_4s_ease-in-out_infinite]">
            <Zap size={14} className="text-secondary-500" />
            Chega de climão
          </div>

          <h1 className="text-4xl md:text-7xl font-heading font-extrabold text-slate-900 mb-6 max-w-4xl leading-tight">
            Cobre seus clientes <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-600">sem constrangimento.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-700 mb-10 max-w-2xl font-medium">
            Mensagens educadas, automáticas e no tom certo para você receber o que é seu sem perder a amizade ou o cliente.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/register" className={buttonVariants({ variant: 'primary', size: 'lg', className: 'w-full sm:w-auto text-lg px-8 py-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all' })}>
              Criar minha primeira cobrança
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/examples" className={buttonVariants({ variant: 'secondary', size: 'lg', className: 'w-full sm:w-auto py-6' })}>
              Ver exemplos
            </Link>
          </div>

          {/* Social Proof / Trust */}
          <div className="mt-12 text-sm text-slate-500 font-medium">
            Usado por freelancers, terapeutas e profissionais autônomos.
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-heading font-bold text-center mb-16 text-slate-800">
              Por que usar o Cobrança Leve?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<MessageCircle className="text-white" size={28} />}
                title="Mensagens Empáticas"
                description="Textos prontos que cobram sem ofender. Escolha entre tons amigáveis, neutros ou profissionais."
                color="from-blue-400 to-blue-600"
              />
              <FeatureCard
                icon={<Zap className="text-white" size={28} />}
                title="Cobrança Automática"
                description="Configure uma vez e deixe o sistema enviar lembretes antes e depois do vencimento."
                color="from-secondary-400 to-secondary-600"
              />
              <FeatureCard
                icon={<ShieldCheck className="text-white" size={28} />}
                title="Profissionalismo"
                description="Painel organizado para gerenciar quem te deve, com links de pagamento e histórico."
                color="from-teal-400 to-teal-600"
              />
            </div>
          </div>
        </section>

        {/* Preview Section */}
        <section className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <div className="gradient-card rotate-[-2deg] max-w-sm mx-auto">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">😊</span>
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Ana Psicóloga</div>
                    <div className="text-xs text-slate-500">Online agora</div>
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg rounded-tl-none mb-2 text-sm text-slate-700 shadow-sm">
                  Oi, tudo bem? 😊 Passando só para lembrar da nossa sessão e do pagamento combinado.
                </div>
                <div className="bg-green-50 p-3 rounded-lg rounded-tl-none text-sm text-slate-700 shadow-sm">
                  Se já enviou o comprovante, desconsidere! Obrigada.
                </div>
                <div className="mt-4 text-xs text-center text-slate-400">
                  Mensagem enviada via WhatsApp
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2">
            <h3 className="text-3xl font-heading font-bold mb-4 text-slate-900">
              Você não precisa saber cobrar. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">Nós sabemos.</span>
            </h3>
            <p className="text-slate-600 mb-6 text-lg font-medium">
              Evite aquele frio na barriga na hora de pedir o pagamento. Nosso sistema sabe exatamente o que dizer para manter a relação saudável.
            </p>
            <ul className="space-y-4 mb-8">
              <ListItem>Modelos testados de alta conversão</ListItem>
              <ListItem>Envio por WhatsApp e Email</ListItem>
              <ListItem>Link de pagamento integrado (Em breve)</ListItem>
            </ul>
            <Link href="/register" className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-lg hover:shadow-xl' })}>
              Começar Agora
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white/40 backdrop-blur-md border-t border-white/50 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-slate-600 font-medium">
          <div>© 2024 Cobrança Leve. Feito com amor.</div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-primary-600 transition-colors">Termos</Link>
            <Link href="#" className="hover:text-primary-600 transition-colors">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  return (
    <div className="gradient-card hover:shadow-xl transition-all hover:-translate-y-2 group">
      <div className="p-6 h-full flex flex-col">
        <div className={`mb-6 w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed font-medium">{description}</p>
      </div>
    </div>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3 text-slate-700 font-medium">
      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 shadow-sm">
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      {children}
    </li>
  );
}
