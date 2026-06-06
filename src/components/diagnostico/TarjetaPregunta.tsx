import { DiagnosticQuestion } from "@/lib/types";

export function TarjetaPregunta({
  question,
  value,
  onChange,
}: {
  question: DiagnosticQuestion;
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-accent">{question.block}</p>
      <h3 className="font-heading text-xl font-bold">{question.text}</h3>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {question.options.map((option) => (
          <button
            key={option.label}
            type="button"
            className={`focus-ring rounded border px-4 py-3 text-left text-sm transition ${
              value === String(option.score)
                ? "border-accent bg-accent/12 text-white"
                : "border-white/10 bg-black/20 text-white/72 hover:border-white/30"
            }`}
            onClick={() => onChange(String(option.score))}
          >
            {option.label}
          </button>
        ))}
      </div>
    </article>
  );
}
