# PokéCollection

Gerencie e exiba sua coleção de cartas Pokémon em um só lugar.

## Stack

- **React 19** + **Vite 7** + **TypeScript 5**
- **Tailwind CSS v4** + **shadcn/ui** (New York)
- **TanStack Router v1** + **TanStack Query v5**
- **Supabase** (Auth + PostgreSQL + RLS)
- **React Hook Form** + **Zod**
- **Vercel** (deploy)

## Funcionalidades

- ✅ Autenticação (email/senha + recuperação de senha)
- ✅ CRUD completo de cartas Pokémon
- ✅ Visual estilo TCG real com gradientes por raridade
- ✅ Filtro por nome e raridade
- ✅ Preview em tempo real ao criar/editar carta
- ✅ Dashboard com estatísticas da coleção
- ✅ Modo escuro / claro / sistema
- ✅ Command palette (⌘K / Ctrl+K)

## Desenvolvimento local

```bash
pnpm install
pnpm dev
```

Acesse: http://localhost:3001

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
cp .env.example .env.local
```

| Variável | Obrigatória | Descrição |
|---|---|---|
| `VITE_SUPABASE_URL` | ✅ | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Chave anon do Supabase |
| `VITE_APP_TITLE` | — | Nome da aplicação |
| `INTERNAL_SECRET` | ✅ | Segredo para funções serverless |
| `RESEND_API_KEY` | — | Chave Resend para e-mails |

## Deploy

```bash
vercel --prod
```
