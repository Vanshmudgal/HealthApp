"use client";

import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7 md:px-10">
      <Link href="/">
        <span
          className="text-xl tracking-tight text-[#EFE9DC]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
        >
          NutriAI
        </span>
      </Link>
      <nav className="hidden items-center gap-8 text-sm text-[#B9C2B7] md:flex">
        <a href="#how" className="hover:text-[#EFE9DC]">
          How it works
        </a>
        <Link href="/analytics" className="hover:text-[#EFE9DC]">
          Analytics
        </Link>
        <Link href="/logging" className="hover:text-[#EFE9DC]">
          Get started
        </Link>
      </nav>

      <div className="flex items-center gap-4">
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
    </header>
  );
}
