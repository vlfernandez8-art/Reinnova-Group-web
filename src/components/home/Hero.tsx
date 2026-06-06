"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const stats = ["Contannova + Infrannova", "Sitennova + Safennova", "Diagnóstico operativo en 5 minutos"];

export function Hero() {
  return (
    <section id="inicio" className="relative min-h-[94vh] overflow-hidden pt-28">
      <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:72px_72px]" />
      <motion.div
        className="absolute left-1/2 top-24 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full border border-accent/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="pointer-events-none absolute right-[12%] top-[22%] h-56 w-56 rounded-full bg-accent2/20 blur-3xl"
        animate={{ x: [0, 24, -12, 0], y: [0, -18, 14, 0], opacity: [0.28, 0.48, 0.35, 0.28] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="section-shell relative grid min-h-[calc(94vh-7rem)] items-center gap-10 pb-20 lg:grid-cols-[0.9fr_1fr]">
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="mb-5 inline-flex rounded border border-accent/35 px-3 py-2 text-sm font-semibold text-accent">
            Plataformas SaaS + diagnóstico operativo
          </p>
          <h1 className="max-w-3xl font-heading text-5xl font-bold leading-[1.03] md:text-7xl">
            Reinnova Group impulsa la eficiencia operativa
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
            Construimos productos tecnológicos para empresas que necesitan automatizar, medir y escalar sin perder control.
            El diagnóstico gratuito detecta dónde están las fugas antes de implementar la solución.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/diagnostico" className="inline-flex items-center justify-center gap-2 rounded bg-accent px-6 py-4 font-bold text-black transition hover:bg-white">
              Hacé tu diagnóstico gratuito
              <ArrowRight size={18} />
            </Link>
            <Link href="/#servicios" className="inline-flex items-center justify-center rounded border border-white/16 px-6 py-4 font-bold text-white transition hover:border-accent">
              Ver soluciones
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
          transition={{ opacity: { duration: 0.7 }, scale: { duration: 0.7 }, y: { delay: 1, duration: 6, repeat: Infinity, ease: "easeInOut" } }}
          className="glow-card glass relative overflow-hidden rounded-lg p-5"
        >
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/20 blur-2xl" />
          <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
            <span className="font-heading font-bold">Panel central de operación</span>
            <span className="rounded bg-success/15 px-3 py-1 text-xs font-bold text-success">EN VIVO</span>
          </div>
          <div className="space-y-4">
            {[
              ["Rendimiento operativo", "78%", "bg-accent"],
              ["Procesos automatizados", "87%", "bg-success"],
              ["Alertas críticas bajo control", "64%", "bg-warning"],
            ].map(([label, value, color]) => (
              <div key={label}>
                <div className="mb-2 flex justify-between text-sm text-white/72">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded bg-white/10">
                  <motion.div className={`h-full ${color}`} initial={{ width: 0 }} animate={{ width: value }} transition={{ delay: 0.5, duration: 1 }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {["1.2h", "4 áreas", "ROI"].map((item) => (
              <div key={item} className="rounded border border-white/10 bg-white/[0.03] p-4 text-center font-heading text-xl font-bold">
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <div className="section-shell relative -mt-16 grid gap-3 pb-12 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat} className="glow-card rounded border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-sm text-white/72">
            {stat}
          </div>
        ))}
      </div>
    </section>
  );
}
