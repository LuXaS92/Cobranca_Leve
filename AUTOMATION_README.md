# Automação de Cobranças - Guia de Uso

## 📋 Visão Geral

Sistema de automação completo que envia lembretes de cobrança automaticamente em momentos estratégicos:
- **3 dias antes** do vencimento (tom amigável)
- **No dia** do vencimento (tom neutro)
- **Após** o vencimento (tom profissional)

## 🚀 Como Funcionar

### Pré-requisitos

1. **Redis** rodando localmente ou remotamente
   ```bash
   # Instalar Redis (Ubuntu/Debian)
   sudo apt-get install redis-server
   
   # Iniciar Redis
   redis-server
   
   # Ou usar Docker
   docker run -d -p 6379:6379 redis:alpine
   ```

2. **Variáveis de Ambiente** (opcional)
   ```env
   # .env
   REDIS_URL=redis://localhost:6379
   CRON_ENABLED=true
   CRON_SCHEDULE="0 8 * * *"  # 8 AM diariamente
   ```

### Executar a Automação

Você precisa rodar **3 processos** simultaneamente:

#### 1. Servidor Next.js (Frontend + API)
```bash
npm run dev
```

#### 2. Worker (Processa os lembretes)
```bash
npm run worker
```

#### 3. Cron (Agenda os lembretes diariamente)
```bash
npm run cron
```

## 🧪 Testar Manualmente

### Via API (Recomendado para testes)

1. Faça login no sistema
2. Acesse: `POST /api/cron/process-charges`
3. Ou use curl:
   ```bash
   curl -X POST http://localhost:3000/api/cron/process-charges \
     -H "Cookie: next-auth.session-token=SEU_TOKEN"
   ```

### Via Cron (Produção)

O cron executará automaticamente às 8h da manhã (ou conforme `CRON_SCHEDULE`).

## 📊 Monitoramento

### Logs do Worker
```bash
npm run worker
# Você verá:
# ✅ Job xyz completed
# 📬 Email sent!
# Preview URL: https://ethereal.email/message/...
```

### Logs do Cron
```bash
npm run cron
# Você verá:
# 🔄 [Cron] Starting charge reminder processing...
# ✅ [Cron] Enqueued before_due reminder for charge abc
```

### Verificar Fila (BullMQ)

Você pode usar o BullMQ Board para visualizar a fila:
```bash
npx bull-board
```

## 🔄 Fluxo de Funcionamento

```
1. Cron Job (08:00 diariamente)
   ↓
2. Busca cobranças PENDING
   ↓
3. Calcula dias até vencimento
   ↓
4. Enfileira jobs no BullMQ
   ↓
5. Worker processa jobs
   ↓
6. Envia email/WhatsApp
   ↓
7. Atualiza flags no banco
```

## 🛡️ Regras de Segurança

- ✅ Não envia lembretes duplicados
- ✅ Para automaticamente se cobrança for paga
- ✅ Valida ownership (usuário só envia para seus clientes)
- ✅ Retry automático em caso de falha (3 tentativas)
- ✅ Idempotência garantida

## 📝 Exemplos de Mensagens

### Before Due (3 dias antes)
```
Oi João, tudo bem? 😊

Passando só para lembrar que o pagamento de R$ 150.00 vence em 3 dias (10/01/2026).

Se já tiver feito, por favor desconsidere! Qualquer dúvida estou à disposição.
```

### Due Day (dia do vencimento)
```
Olá João,

Hoje é o dia do vencimento do pagamento de R$ 150.00.

Caso já tenha realizado, por favor envie o comprovante. Obrigado!
```

### Overdue (após vencimento)
```
Prezado(a) João,

Notamos que o pagamento de R$ 150.00 com vencimento em 10/01/2026 ainda está pendente.

Por favor, regularize quando possível ou entre em contato caso haja alguma divergência.

Atenciosamente.
```

## 🐛 Troubleshooting

### Redis não conecta
```bash
# Verificar se Redis está rodando
redis-cli ping
# Deve retornar: PONG
```

### Worker não processa jobs
```bash
# Verificar logs do worker
npm run worker

# Verificar se há jobs na fila
redis-cli
> KEYS bull:charge-reminders:*
```

### Cron não agenda
```bash
# Verificar variável de ambiente
echo $CRON_ENABLED  # deve ser 'true' ou vazio

# Forçar execução manual
curl -X POST http://localhost:3000/api/cron/process-charges
```

## 🚀 Deploy em Produção

### Opção 1: Processos Separados
- Deploy Next.js normalmente (Vercel, etc)
- Worker e Cron em servidor separado (Railway, Render, etc)

### Opção 2: Tudo Junto
- Use PM2 para gerenciar múltiplos processos:
  ```bash
  pm2 start npm --name "web" -- run start
  pm2 start npm --name "worker" -- run worker
  pm2 start npm --name "cron" -- run cron
  ```

### Redis em Produção
- Use Redis Cloud, Upstash, ou Redis Labs
- Configure `REDIS_URL` com a URL de produção

## 📚 Arquivos Importantes

- `src/lib/queue/index.ts` - Configuração BullMQ
- `src/lib/queue/worker.ts` - Worker de processamento
- `src/lib/cron/charge-scheduler.ts` - Cron scheduler
- `src/lib/services/charge-reminder.ts` - Lógica de negócio
- `src/app/api/cron/process-charges/route.ts` - API manual trigger

## 🎯 Próximos Passos

- [ ] Dashboard para visualizar fila
- [ ] Notificações de falha
- [ ] Métricas e analytics
- [ ] Suporte a WhatsApp automático (via API)
- [ ] Templates customizáveis por usuário
