# Persona AI

A small Next.js app for chatting with AI recreations of two Indian tech
educators — **Hitesh Sir** and **Piyush Sir**. Each persona is
prompt-engineered to sound like the real person: their vocabulary, teaching
style, and humour — not a generic chatbot.

> Work in progress. Right now this is just the landing page and project
> scaffold; the chat experience is being built up in phases.

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Environment

Copy the example env file and fill in your own key (needed for the chat
functionality added in a later phase):

```bash
cp .env.local.example .env.local
```

| Variable         | Description          |
| ---------------- | -------------------- |
| `OPENAI_API_KEY` | Your OpenAI API key. |

## Tech

- Next.js (App Router) + TypeScript
- Tailwind CSS

## Project structure

```
src/
  app/          # routes
  components/   # reusable UI
  lib/          # helpers, constants (persona prompts, OpenAI client — later)
  types/        # shared TypeScript types
public/
  images/       # persona avatars (added separately)
```
