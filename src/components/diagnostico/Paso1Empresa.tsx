"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CompanyData } from "@/lib/types";

const blockedEmailDomains = new Set([
  "example.com",
  "example.org",
  "example.net",
  "test.com",
  "mailinator.com",
  "tempmail.com",
  "temp-mail.org",
  "10minutemail.com",
  "guerrillamail.com",
  "yopmail.com",
  "discard.email",
  "fakeinbox.com",
]);

function isLikelyRealEmail(value: string) {
  const email = value.trim().toLowerCase();
  const match = email.match(/^([a-z0-9.!#$%&'*+/=?^_`{|}~-]+)@([a-z0-9-]+(?:\.[a-z0-9-]+)+)$/i);
  if (!match) return false;

  const [, localPart, domain] = match;
  const domainParts = domain.split(".");
  const tld = domainParts.at(-1) ?? "";

  if (blockedEmailDomains.has(domain)) return false;
  if (localPart.length < 2 || localPart.includes("..")) return false;
  if (["test", "prueba", "demo", "fake", "noemail", "sincorreo"].includes(localPart)) return false;
  if (domainParts.some((part) => part.length < 2 || part.startsWith("-") || part.endsWith("-"))) return false;
  if (tld.length < 2 || /^\d+$/.test(tld)) return false;

  return true;
}

const schema = z.object({
  empresa: z.string().min(2, "Ingresá el nombre de la empresa"),
  nombre: z.string().min(2, "Ingresá tu nombre"),
  cargo: z.string().min(2, "Ingresá tu cargo"),
  email: z.string().trim().email("Ingresa un email valido").refine(isLikelyRealEmail, "Ingresa un email real de contacto"),
  whatsapp: z.string().optional(),
  empleados: z.string().min(1, "Seleccioná cantidad de empleados"),
  facturacion: z.string().min(1, "Seleccioná facturación"),
  privacyAccepted: z.boolean().refine((accepted) => accepted, "Debés aceptar la Política de Privacidad y los Términos de Uso"),
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
    defaultValues: { ...value, privacyAccepted: false },
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

      <label className="flex items-start gap-3 rounded border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/72">
        <input type="checkbox" className="mt-1 h-4 w-4 accent-cyan-400" {...register("privacyAccepted")} />
        <span>
          Declaro haber leído y acepto la{" "}
          <Link href="/politica-de-privacidad" target="_blank" className="font-bold text-accent underline underline-offset-4">
            Política de Privacidad
          </Link>{" "}
          y los{" "}
          <Link href="/terminos-de-uso" target="_blank" className="font-bold text-accent underline underline-offset-4">
            Términos de Uso
          </Link>
          , y autorizo el tratamiento de mis datos para generar el diagnóstico y recibir comunicaciones relacionadas con mi solicitud.
          {errors.privacyAccepted ? <span className="mt-1 block text-xs text-danger">{errors.privacyAccepted.message}</span> : null}
        </span>
      </label>

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

