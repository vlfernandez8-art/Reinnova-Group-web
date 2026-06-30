"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

const links = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/#metodologia", label: "Metodologia" },
  { href: "/diagnostico", label: "Diagnostico" },
  { href: "/#contacto", label: "Contacto" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all ${
        scrolled ? "border-b border-white/10 bg-black/70 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="section-shell flex h-20 items-center justify-between gap-5">
        <Link href="/" className="focus-ring relative h-12 w-56 shrink-0 overflow-hidden rounded-md md:w-72 xl:w-80">
          <Image
            src="/reinnova-group-logo.png"
            alt="Reinnova Group"
            fill
            priority
            className="object-contain object-left"
            sizes="(max-width: 768px) 224px, (max-width: 1024px) 288px, 320px"
          />
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-end gap-4 xl:flex 2xl:gap-7">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="whitespace-nowrap text-sm text-white/72 transition hover:text-white">
              {link.label}
            </Link>
          ))}
          <Link href="/eventos" className="whitespace-nowrap text-sm text-white/72 transition hover:text-white">
            Eventos
          </Link>
        </div>

        <div className="hidden shrink-0 items-center gap-2 xl:flex">
          <Link
            href="/diagnostico"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded bg-accent px-4 py-3 text-sm font-bold text-black transition hover:bg-white"
          >
            Inicia tu Diagnostico Gratuito
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/soy-reinnova/login"
            className="whitespace-nowrap rounded border border-accent px-4 py-3 text-sm font-bold text-accent transition hover:bg-accent hover:text-black"
          >
            Soy Reinnova
          </Link>
        </div>

        <button
          aria-label="Abrir menu"
          className="grid h-11 w-11 place-items-center rounded border border-white/12 xl:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-white/10 bg-black/92 px-4 py-5 lg:hidden">
          <div className="mx-auto flex max-w-xl flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded border border-white/10 px-4 py-3 text-white/80"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/eventos"
              className="rounded border border-white/10 px-4 py-3 text-white/80"
              onClick={() => setOpen(false)}
            >
              Eventos
            </Link>
            <Link
              href="/diagnostico"
              className="rounded bg-accent/90 px-4 py-3 text-center font-bold text-black"
              onClick={() => setOpen(false)}
            >
              Inicia tu Diagnostico Gratuito
            </Link>
            <Link
              href="/soy-reinnova/login"
              className="rounded border border-accent px-4 py-3 text-accent"
              onClick={() => setOpen(false)}
            >
              Soy Reinnova
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
