"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CompanyData } from "@/lib/types";

const schema = z.object({
  empresa: z.string().min(2, "Ingresá el nombre de la empresa"),
  nombre: z.string().min(2, "Ingresá tu nombre"),
  cargo: z.string().min(2, "Ingresá tu cargo"),
  email: z.string().email("Ingresá un email válido"),
  whatsapp: z.string().optional(),
  empleados: z.string().min(1, "Seleccioná cantidad de empleados"),
  facturacion: z.string().min(1, "Seleccioná facturación"),
});
type CompanyFormValues = z.infer<typeof schema>;

const employees = ["1-5", "6-15", "16-50", "51-200", "+200"] as const;
const revenues = ["Hasta $500k", "$500k-$2M", "$2M-$10M", "$10M-$50M", "+$50M"] as const;

export function Paso1Empresa({
  value,
  onSubmit,
}: {
  value: CompanyData;
  onSubmit: (data: CompanyData) => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(schema),
    defaultValues: value,
  });

  const selectedEmployees = watch("empleados");
  const selectedRevenue = watch("facturacion");

  return (
    <form className="grid gap-5" onSubmit={handleSubmit((data) => onSubmit(data as CompanyData))}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nombre de la empresa" error={errors.empresa?.message}>
          <input className="input" {...register("empresa")} />
        </Field>
        <Field label="Nombre de quien completa" error={errors.nombre?.message}>
          <input className="input" {...register("nombre")} />
        </Field>
        <Field label="Cargo / Rol" error={errors.cargo?.message}>
          <input className="input" {...register("cargo")} />
        </Field>
        <Field label="Email de contacto" error={errors.email?.message}>
          <input className="input" type="email" {...register("email")} />
        </Field>
        <Field label="WhatsApp (opcional)">
          <input className="input" type="tel" {...register("whatsapp")} />
        </Field>
      </div>

      <ChoiceGroup
        label="Cantidad de empleados"
        options={employees}
        value={selectedEmployees}
        onSelect={(item) => setValue("empleados", item, { shouldValidate: true })}
        error={errors.empleados?.message}
      />
      <ChoiceGroup
        label="Facturación mensual aproximada en ARS"
        options={revenues}
        value={selectedRevenue}
        onSelect={(item) => setValue("facturacion", item, { shouldValidate: true })}
        error={errors.facturacion?.message}
      />

      <button className="rounded bg-accent px-6 py-4 font-bold text-black transition hover:bg-white" type="submit">
        Continuar
      </button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-white/78">
      {label}
      {children}
      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </label>
  );
}

function ChoiceGroup<T extends string>({
  label,
  options,
  value,
  onSelect,
  error,
}: {
  label: string;
  options: readonly T[];
  value: string;
  onSelect: (value: T) => void;
  error?: string;
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-bold text-white/78">{label}</p>
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`rounded border px-4 py-3 text-sm font-bold ${
              value === option ? "border-accent bg-accent/15 text-accent" : "border-white/10 bg-white/[0.03] text-white/72"
            }`}
            onClick={() => onSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
      {error ? <span className="mt-2 block text-xs text-danger">{error}</span> : null}
    </div>
  );
}
