# Cobrança Leve 🍃

> Cobre seus clientes sem climão. Um SaaS de cobrança empática e automatizada.

O **Cobrança Leve** é uma plataforma projetada para ajudar autônomos e pequenas empresas a gerenciar cobranças de forma profissional e automatizada, preservando o relacionamento com o cliente através de uma comunicação empática.

![Dashboard Preview](https://via.placeholder.com/800x400?text=Dashboard+Preview)

## 🚀 Funcionalidades

-   **Gestão de Cobranças**: Crie, edite e acompanhe o status de pagamentos.
-   **Comunicação Empática**: Templates de mensagens (WhatsApp e Email) com tons ajustáveis (Amigável, Neutro, Profissional).
-   **Automação Inteligente**: Envio automático de lembretes (3 dias antes, no dia, e após vencimento).
-   **Dashboard Vibrante**: Visão geral financeira com design moderno e responsivo.
-   **Gestão de Clientes**: Cadastro e histórico de pagadores.
-   **Login Seguro**: Autenticação via NextAuth com recuperação de senha.

## 🛠️ Tecnologias

Este projeto utiliza as tecnologias mais modernas do ecossistema React/Node:

-   **Frontend**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
-   **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/) (com tema customizado e animações)
-   **Banco de Dados**: PostgreSQL com [Prisma ORM](https://www.prisma.io/)
-   **Autenticação**: [NextAuth.js](https://next-auth.js.org/)
-   **Automação**: BullMQ (Filas) + Redis + Node-Cron
-   **Ícones**: Lucide React

## 📦 Instalação

### Pré-requisitos
-   Node.js 18+
-   PostgreSQL
-   Redis (para as filas de automação)

### Passo a Passo

1.  **Clone o repositório**
    ```bash
    git clone https://github.com/seu-usuario/cobranca-leve.git
    cd cobranca-leve
    ```

2.  **Instale as dependências**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente**
    Crie um arquivo `.env` na raiz baseado no exemplo:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/cobranca_leve"
    NEXTAUTH_SECRET="sua-chave-secreta"
    NEXTAUTH_URL="http://localhost:3000"
    REDIS_URL="redis://localhost:6379"
    ```

4.  **Configure o Banco de Dados**
    ```bash
    npx prisma db push
    ```

5.  **Inicie o Servidor de Desenvolvimento**
    ```bash
    npm run dev
    ```
    Acesse `http://localhost:3000`.

## 🤖 Rodando a Automação

Para que os lembretes automáticos funcionem, você precisa rodar os scripts de worker e cron em terminais separados (ou configurá-los no seu servidor):

```bash
# Terminal 2: Worker (Processa envio de mensagens)
npm run worker

# Terminal 3: Cron (Agendador diário)
npm run cron
```

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## 📄 Licença

Este projeto está sob a licença MIT.
