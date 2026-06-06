"use client";

import { getQuestionsForRubro } from "@/lib/preguntas";
import { Answers, RubroId } from "@/lib/types";
import { TarjetaPregunta } from "./TarjetaPregunta";

export function Paso3Preguntas({
  rubro,
  answers,
  onChange,
  onNext,
  onBack,
}: {
  rubro: RubroId | "";
  answers: Answers;
  onChange: (answers: Answers) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const questions = getQuestionsForRubro(rubro);
  const complete = questions.every((question) => answers[question.id] !== undefined);

  return (
    <div className="grid gap-5">
      {questions.map((question) => (
        <TarjetaPregunta
          key={question.id}
          question={question}
          value={answers[question.id]}
          onChange={(value) => onChange({ ...answers, [question.id]: value })}
        />
      ))}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="rounded border border-white/12 px-6 py-4 font-bold" onClick={onBack} type="button">
          Volver
        </button>
        <button className="rounded bg-accent px-6 py-4 font-bold text-black disabled:cursor-not-allowed disabled:opacity-50" onClick={onNext} disabled={!complete} type="button">
          Continuar
        </button>
      </div>
    </div>
  );
}
