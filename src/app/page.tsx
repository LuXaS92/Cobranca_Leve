import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, ShieldCheck, Zap, ArrowRight, MessageCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white">
              <Heart size={18} fill="currentColor" />
            </div>
            <span className="font-heading font-bold text-xl text-slate-800">
              Cobrança Leve
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-primary-600 hidden sm:block">
              Entrar
            </Link>
            <Link href="/register">
              <Button size="sm">Começar Grátis</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-24 pb-12">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-24 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold uppercase tracking-wide mb-6">
            <Zap size={14} />
            Chega de climão
          </div>

          <h1 className="text-4xl md:text-6xl font-heading font-bold text-slate-900 mb-6 max-w-3xl leading-tight">
            Cobre seus clientes <br />
            <span className="text-primary-500">sem constrangimento.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl">
            Mensagens educadas, automáticas e no tom certo para você receber o que é seu sem perder a amizade ou o cliente.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                Criar minha primeira cobrança
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Ver exemplos
              </Button>
            </Link>
          </div>

          {/* Social Proof / Trust */}
          <div className="mt-12 text-sm text-slate-400">
            Usado por freelancers, terapeutas e profissionais autônomos.
          </div>
        </section>

        {/* Feature Grid */}
        <section className="bg-slate-50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-heading font-bold text-center mb-16">
              Por que usar o Cobrança Leve?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<MessageCircle className="text-primary-500" size={32} />}
                title="Mensagens Empáticas"
                description="Textos prontos que cobram sem ofender. Escolha entre tons amigáveis, neutros ou profissionais."
              />
              <FeatureCard
                icon={<Zap className="text-secondary-500" size={32} />}
                title="Cobrança Automática"
                description="Configure uma vez e deixe o sistema enviar lembretes antes e depois do vencimento."
              />
              <FeatureCard
                icon={<ShieldCheck className="text-teal-600" size={32} />}
                title="Profissionalismo"
                description="Painel organizado para gerenciar quem te deve, com links de pagamento e histórico."
              />
            </div>
          </div>
        </section>

        {/* Preview Section */}
        <section className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-sm mx-auto transform rotate-[-2deg]">
              <div className="flex items-center gap-3 mb-4 border-b pb-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">😊</span>
                </div>
                <div>
                  <div className="font-bold text-slate-800">Ana Psicóloga</div>
                  <div className="text-xs text-slate-500">Online agora</div>
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg rounded-tl-none mb-2 text-sm text-slate-700">
                Oi, tudo bem? 😊 Passando só para lembrar da nossa sessão e do pagamento combinado.
              </div>
              <div className="bg-green-50 p-3 rounded-lg rounded-tl-none text-sm text-slate-700">
                Se já enviou o comprovante, desconsidere! Obrigada.
              </div>
              <div className="mt-4 text-xs text-center text-slate-400">
                Mensagem enviada via WhatsApp
              </div>
            </div>
          </div>
          <div className="md:w-1/2">
            <h3 className="text-3xl font-heading font-bold mb-4">
              Você não precisa saber cobrar. <br />
              <span className="text-primary-500">Nós sabemos.</span>
            </h3>
            <p className="text-slate-600 mb-6 text-lg">
              Evite aquele frio na barriga na hora de pedir o pagamento. Nosso sistema sabe exatamente o que dizer para manter a relação saudável.
            </p>
            <ul className="space-y-3 mb-8">
              <ListItem>Modelos testados de alta conversão</ListItem>
              <ListItem>Envio por WhatsApp e Email</ListItem>
              <ListItem>Link de pagamento integrado (Em breve)</ListItem>
            </ul>
            <Link href="/register">
              <Button>Começar Agora</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-100 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <div>© 2024 Cobrança Leve. Feito com amor.</div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-primary-500">Termos</Link>
            <Link href="#" className="hover:text-primary-500">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1">
      <div className="mb-4 bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-slate-700">
      <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      {children}
    </li>
  );
}
