"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

const links = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/#metodologia", label: "Metodología" },
  { href: "/diagnostico", label: "Diagnóstico" },
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
      <nav className="section-shell flex h-20 items-center justify-between">
        <Link href="/" className="focus-ring relative h-12 w-56 overflow-hidden rounded-md md:w-72 lg:w-80">
          <Image
            src="/reinnova-group-logo.png"
            alt="Reinnova Group"
            fill
            priority
            className="object-contain object-left"
            sizes="(max-width: 768px) 224px, (max-width: 1024px) 288px, 320px"
          />
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-white/72 transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/diagnostico"
          className="hidden items-center gap-2 rounded bg-accent px-4 py-3 text-sm font-bold text-black transition hover:bg-white lg:flex"
        >
          Iniciá tu Diagnóstico Gratuito
          <ArrowRight size={16} />
        </Link>

        <button
          aria-label="Abrir menú"
          className="grid h-11 w-11 place-items-center rounded border border-white/12 lg:hidden"
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
          </div>
        </div>
      ) : null}
    </header>
  );
}
