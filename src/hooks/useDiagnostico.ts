"use client";

import { useEffect, useMemo, useState } from "react";
import { calculateScore } from "@/lib/scoring";
import { DiagnosticoState } from "@/lib/types";

const storageKey = "reinnova-diagnostico-state";

export const initialDiagnosticoState: DiagnosticoState = {
  step: 1,
  company: {
    empresa: "",
    nombre: "",
    cargo: "",
    email: "",
    whatsapp: "",
    empleados: "",
    facturacion: "",
  },
  profile: {
    rubro: "",
    rubroOtro: "",
    perfilDeclarado: "",
  },
  answers: {},
  economic: {
    horasSemanaAdmin: 12,
    salarioPromedio: 350000,
    salarioRango: "$300k-$500k",
    erroresMensuales: 0,
    erroresDetalle: "",
    demoraBalance: "1 semana",
    ventasPerdidas: "No",
  },
};

export function useDiagnostico() {
  const [state, setState] = useState<DiagnosticoState>(initialDiagnosticoState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<DiagnosticoState>;
      setState({
        ...initialDiagnosticoState,
        ...parsed,
        company: { ...initialDiagnosticoState.company, ...parsed.company },
        profile: { ...initialDiagnosticoState.profile, ...parsed.profile },
        economic: { ...initialDiagnosticoState.economic, ...parsed.economic },
        answers: parsed.answers ?? initialDiagnosticoState.answers,
      });
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    }
  }, [hydrated, state]);

  const result = useMemo(() => calculateScore(state), [state]);

  const reset = () => {
    setState(initialDiagnosticoState);
    window.localStorage.removeItem(storageKey);
  };

  return { state, setState, result, reset, hydrated };
}
