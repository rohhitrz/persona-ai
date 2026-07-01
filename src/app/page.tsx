import NameGate from "@/components/NameGate";
import PersonaCard from "@/components/PersonaCard";
import { PERSONAS } from "@/lib/constants";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <NameGate />
      <div className="w-full max-w-3xl">
        <div className="text-center">
          <span className="inline-block rounded-full border border-stone-200 bg-white/70 px-3 py-1 text-xs font-medium uppercase tracking-wider text-stone-500">
            Persona AI
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Chat with your favourite mentors
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base text-stone-500">
            Pick a mentor and start a conversation. Each one talks, teaches, and
            jokes just like the real person.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {PERSONAS.map((persona) => (
            <PersonaCard key={persona.id} persona={persona} />
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-stone-400">
          personas are AI recreations, built for
          learning.
        </p>
      </div>
    </main>
  );
}
