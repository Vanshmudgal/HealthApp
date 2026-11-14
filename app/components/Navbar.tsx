"use client";

import { useState } from "react";
import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

const links = [
  { href: "/#how", label: "How it works" },
  { href: "/analytics", label: "Analytics" },
  { href: "/logging", label: "Get started" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="relative z-50 mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10 md:py-7">
      <Link href="/" onClick={close}>
        <span
          className="text-xl tracking-tight text-[#EFE9DC]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
        >
          NutriAI
        </span>
      </Link>

      {/* Desktop nav */}
      <nav className="hidden items-center gap-8 text-sm text-[#B9C2B7] md:flex">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="hover:text-[#EFE9DC]">
            {l.label}
          </Link>
        ))}
      </nav>

      {/* Desktop auth */}
      <div className="hidden items-center gap-4 md:flex">
        <Show when="signed-out">
          <SignInButton>
            <button className="text-sm text-[#B9C2B7] hover:text-[#EFE9DC]">
              Sign in
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="rounded-sm bg-[#DDA53B] px-4 py-2 text-sm font-medium text-[#16211B] transition-colors hover:bg-[#e8b657]">
              Start logging
            </button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>

      {/* Mobile: avatar + hamburger */}
      <div className="flex items-center gap-3 md:hidden">
        <Show when="signed-in">
          <UserButton />
        </Show>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-sm text-[#EFE9DC] hover:bg-white/5"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div
          id="mobile-menu"
          className="absolute left-0 right-0 top-full border-y border-white/10 bg-[#16211B] px-6 pb-6 pt-2 shadow-xl md:hidden"
        >
          <nav className="flex flex-col text-[#B9C2B7]">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={close}
                className="border-b border-white/5 py-4 text-base hover:text-[#EFE9DC]"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <Show when="signed-out">
            <div className="mt-5 flex flex-col gap-3">
              <SignInButton>
                <button
                  onClick={close}
                  className="w-full rounded-sm border border-white/15 px-4 py-3 text-sm text-[#EFE9DC] hover:bg-white/5"
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton>
                <button
                  onClick={close}
                  className="w-full rounded-sm bg-[#DDA53B] px-4 py-3 text-sm font-medium text-[#16211B] transition-colors hover:bg-[#e8b657]"
                >
                  Start logging
                </button>
              </SignUpButton>
            </div>
          </Show>
        </div>
      )}
    </header>
  );
}