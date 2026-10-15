---
name: nextjs-typescript-architecture
description: Diretrizes de arquitetura Clean, boas práticas Node.js, Next.js App Router, TypeScript estrito, Prisma ORM, Zod, BullMQ, Tailwind CSS e isolamento de banco de dados para o projeto Team Pulse Hub.
---

# 📐 Skill: Next.js, Node.js & TypeScript Clean Architecture Standard

Você é um especialista em engenharia de software com foco no ecossistema Full-Stack **Next.js (App Router)**, **Node.js (LTS)**, **TypeScript (Strict Mode)**, **Prisma ORM**, **PostgreSQL**, **Zod**, **BullMQ (Redis)** e **Tailwind CSS**. Siga estritamente estas diretrizes ao planejar, revisar ou implementar código neste projeto.

---

## 1. Princípios de TypeScript Moderno & Node.js

- **Tipagem Forte e Strict Mode:**
  - NUNCA utilize `any`. Tipos devem ser explicitamente definidos ou inferidos via Zod (`z.infer<typeof Schema>`).
  - Evite type assertions agressivas (`as unknown as Type`). Utilize type guards (`if (isType(...))`) e Zod para parsing em tempo de execução.
- **Tratamento Estruturado de Erros:**
  - Utilize blocos `try/catch` estruturados com classes de erro customizadas (ex: `NotFoundError`, `UnauthorizedError`, `ValidationError`).
  - Em APIs e Server Actions, converta erros capturados em respostas consistentes com códigos HTTP semânticos (400, 401, 403, 404, 409, 500).
- **Isolamento Server-Only:**
  - Utilitários, repositórios Prisma, filas BullMQ e serviços que lidam com banco de dados ou segredos DEVEM incluir `import 'server-only'` no topo do arquivo para garantir que nunca sejam incluídos no bundle do cliente.
- **Operações Assíncronas:**
  - Utilize `async/await` idiomático. Para chamadas concorrentes independentes, empregue `Promise.all` ou `Promise.allSettled`.
  - Sempre configure timeouts em requisições externas via `AbortController`.

---

## 2. Estrutura Modular de Pastas no Next.js (App Router)

```text
Team_Pulse_Hub/
├── docs/                        # Documentação técnica e manuais dos módulos
├── prisma/
│   ├── schema.prisma            # Definição de modelos, relações, índices e migrações
│   └── migrations/              # Histórico versionado de migrações
├── src/
│   ├── app/                     # Next.js App Router (Pages, Layouts, API Route Handlers)
│   │   ├── api/                 # Thin Route Handlers REST (ex: app/api/teams/route.ts)
│   │   ├── layout.tsx           # Layout raiz
│   │   └── page.tsx             # Página inicial
│   ├── actions/                 # Server Actions para mutações de formulários
│   ├── schemas/                 # Schemas Zod de validação de request, response e DTOs
│   ├── types/                   # Tipos TypeScript puros compartilhados
│   ├── services/                # Casos de uso e regras de negócio da aplicação
│   ├── repositories/            # Camada de acesso a dados (encapsulando Prisma)
│   ├── lib/                     # Utilitários compartilhados, singleton do Prisma, crypto, auth
│   │   ├── prisma.ts            # Instância global Singleton do PrismaClient
│   │   └── crypto.ts            # Criptografia AES-256-GCM para dados sensíveis
│   ├── jobs/                    # Queues, Workers e Handlers BullMQ (Redis)
│   │   ├── queues.ts            # Instâncias de filas BullMQ
│   │   └── workers/             # Processadores em segundo plano
│   └── components/              # Componentes de interface React
│       ├── ui/                  # Componentes reutilizáveis (botões, modais, inputs)
│       └── features/            # Componentes acoplados a domínios específicos
├── tests/                       # Testes automatizados com Vitest
└── .env.example                 # Modelo de variáveis de ambiente
```

---

## 3. Thin Route Handlers & Server Actions

- **Route Handlers (`app/api/.../route.ts`):**
  1. Validar e parsear o payload com Zod:
     ```typescript
     const body = await req.json();
     const parseResult = createTeamSchema.safeParse(body);
     if (!parseResult.success) {
       return NextResponse.json({ error: parseResult.error.flatten() }, { status: 400 });
     }
     ```
  2. Extrair contexto de sessão/autenticação e permissões.
  3. Delegar a operação para a camada de serviço (`teamService.create(parseResult.data, session.userId)`).
  4. Retornar resposta JSON padronizada:
     ```typescript
     return NextResponse.json({ data: result }, { status: 201 });
     ```
- **Server Actions (`src/actions/...`):**
  - Todas as Server Actions devem validar inputs com Zod, assegurar autenticação e invocar `revalidatePath` ou `revalidateTag` para manter o cache da UI atualizado.

---

## 4. Prisma ORM: Singleton, Performance & Transações

### 4.1 Instância Singleton do PrismaClient (`src/lib/prisma.ts`)
```typescript
import 'server-only';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### 4.2 Prevenção Ativa de N+1 Queries
- Sempre carregue associações necessárias em um único comando usando `include` ou `select`:
  ```typescript
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: {
      id: true,
      name: true,
      members: {
        select: { id: true, name: true, role: true },
      },
      pulseMetrics: {
        take: 10,
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  ```

### 4.3 Transações Atômicas
- Operações que envolvam múltiplas mutações DEVEM utilizar `prisma.$transaction`:
  ```typescript
  const result = await prisma.$transaction(async (tx) => {
    const team = await tx.team.create({ data: teamData });
    await tx.teamMember.create({
      data: { teamId: team.id, userId: ownerId, role: 'OWNER' },
    });
    return team;
  });
  ```

---

## 5. Tarefas Assíncronas (BullMQ + Redis)

- **Desacoplamento de Tarefas Pesadas:**
  - Disparos massivos de métricas, envio de e-mails, sincronizações de calendários e relatórios analíticos não devem bloquear a requisição HTTP.
- **Tipagem de Filas e Jobs:**
  ```typescript
  import { Queue } from 'bullmq';

  export const PULSE_METRICS_QUEUE = 'pulse-metrics-queue';

  export interface ProcessPulseJobData {
    teamId: string;
    period: string;
    triggeredBy: string;
  }
  ```
- **Tratamento de Falhas:** Configure retries com backoff exponencial no enfileiramento (`attempts: 3, backoff: { type: 'exponential', delay: 2000 }`).

---

## 6. Frontend: React Server Components & Tailwind CSS

- **Server Components (RSC):**
  - Mantenha componentes como RSC por padrão para buscar dados diretamente via repositórios/serviços no servidor.
- **Client Components (`'use client'`):**
  - Utilize a diretiva `'use client'` estritamente no topo de componentes que necessitam de `useState`, `useEffect`, eventos DOM ou hooks de formulário.
- **Tailwind CSS & Design System:**
  - Adote tema consistente (paleta Slate / Indigo / Emerald), visual refinado com efeitos suaves (`backdrop-blur`, bordas sutis `border-slate-800`), alta legibilidade, foco em acessibilidade e responsividade completa (Mobile, Tablet, Desktop).

---

## 7. 🚨 REGRA CRÍTICA DE ISOLAMENTO DE BANCO DE DADOS EM TESTES

- **PROIBIÇÃO ABSOLUTA**: **NUNCA** execute testes unitários, scripts ou comandos que resetem (`prisma migrate reset --force`), limpem (`TRUNCATE`) ou executem drops de tabela no banco de dados principal de desenvolvimento (`DATABASE_URL`).
- **RISCO GRAVE**: Resetar a base principal apaga dados de desenvolvimento, usuários de teste e configurações do projeto.
- **EXECUÇÃO CORRETA DE TESTES**:
  - Em testes unitários, utilize **Mocks tipados do PrismaClient** (com `vitest-mock-extended`).
  - Para testes de integração de banco de dados, utilize **EXCLUSIVAMENTE** uma base de testes dedicada (`DATABASE_URL_TEST`) configurada em arquivo `.env.test`.
  - **Comando Permitido**: `npx vitest run`
  - **Exemplo ESTRITAMENTE PROIBIDO**: Rodar scripts com `prisma.user.deleteMany()` sem ambiente de teste isolado e confirmado.
