# React + TypeScript + Vite + shadcn/ui

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `src/components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```

## Local Supabase Chat

The source-aware chat calls the local Supabase Edge Function through:

```txt
VITE_CHAT_FUNCTION_URL=http://127.0.0.1:54321/functions/v1/chat
```

Run the local stack and function server in separate terminals:

```bash
pnpm supabase:start
pnpm supabase:functions:chat
pnpm dev
```

`supabase:functions:chat` serves the public demo chat function with JWT verification disabled, while server-only model settings stay in `.env.local`.
