import { Fraunces, Work_Sans } from "next/font/google";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Navbar from "@/app/components/Navbar";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export default function LandingPage() {
  return (
    <div
      className={`${fraunces.variable} ${workSans.variable} min-h-screen bg-[#16211B] text-[#EFE9DC]`}
      style={{ fontFamily: "var(--font-body)" }}
    >
      <Navbar />
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-14 px-6 pb-24 pt-10 md:grid-cols-2 md:gap-10 md:px-10 md:pt-16">
        <div className="flex flex-col justify-center">
          <h1
            className="text-[2.75rem] leading-[1.08] text-[#EFE9DC] md:text-[3.4rem]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            Type what you ate.
            <br />
            <span className="italic text-[#DDA53B]">Get the numbers</span>
            <br />
            back in seconds.
          </h1>
          <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-[#B9C2B7]">
            No searching a food database, no logging each item one by one. Type
            your whole meal the way you&apos;d text a friend, and NutriAI works
            out the calories and macros for you.
          </p>
          <div className="mt-9 flex items-center gap-4">
            <Show when="signed-out">
              <SignUpButton>
                <button className="rounded-sm bg-[#DDA53B] px-6 py-3 text-sm font-medium text-[#16211B] transition-colors hover:bg-[#e8b657]">
                  Start logging free
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <a
                href="/logging"
                className="rounded-sm bg-[#DDA53B] px-6 py-3 text-sm font-medium text-[#16211B] transition-colors hover:bg-[#e8b657]"
              >
                Go to logging
              </a>
            </Show>
            <a
              href="#how"
              className="text-sm text-[#B9C2B7] hover:text-[#EFE9DC]"
            >
              See how it works
            </a>
          </div>
        </div>

        {/* Live-feeling log demo card */}
        <div className="flex items-center">
          <div className="w-full rounded-md border border-[#2B3A31] bg-[#1B2820] p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]">
            <div className="mb-5 flex items-center justify-between text-xs text-[#7C9885]">
              <span>Today, 1:40 PM</span>
              <span>Lunch</span>
            </div>
            <div className="rounded-sm border border-[#2B3A31] bg-[#16211B] px-4 py-3 text-[0.95rem] text-[#EFE9DC]">
              2 rotis, dal, small bowl of rice, side salad
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs text-[#7C9885]">
              <span className="h-1 w-1 rounded-full bg-[#DDA53B]" />
              <span>parsed in 0.8s</span>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {[
                { label: "Cal", value: "540" },
                { label: "Protein", value: "18g" },
                { label: "Carbs", value: "82g" },
                { label: "Fat", value: "14g" },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-sm bg-[#16211B] px-3 py-3 text-center"
                >
                  <div
                    className="text-lg text-[#EFE9DC]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {m.value}
                  </div>
                  <div className="mt-1 text-[0.7rem] text-[#7C9885]">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 border-t border-[#2B3A31] pt-4 text-xs text-[#7C9885]">
              Today so far — 1,340 cal · 61g protein
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how"
        className="border-t border-[#2B3A31] px-6 py-20 md:px-10"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            className="max-w-lg text-3xl text-[#EFE9DC] md:text-4xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            Three steps, no data entry.
          </h2>

          <div className="relative mt-14 grid gap-12 md:grid-cols-3">
            <div className="absolute left-0 right-0 top-3 hidden h-px bg-[#2B3A31] md:block" />
            {[
              {
                title: "Describe your meal",
                body: "Type it in plain language, the way you'd tell someone what you had. No portion sliders, no matching a branded product.",
              },
              {
                title: "NutriAI works it out",
                body: "One sentence for the whole plate — no adding items one at a time. It reasons about typical portions and mixed dishes, whatever it actually was.",
              },
              {
                title: "Watch your day add up",
                body: "Calories and macros land on your dashboard automatically, checked against the goals you set once.",
              },
            ].map((step) => (
              <div key={step.title} className="relative pt-8">
                <div className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-[#DDA53B]" />
                <h3
                  className="text-lg text-[#EFE9DC]"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                >
                  {step.title}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-[#B9C2B7]">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real meals section */}
      <section
        id="food"
        className="border-t border-[#2B3A31] px-6 py-20 md:px-10"
      >
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <h2
              className="text-3xl text-[#EFE9DC] md:text-4xl"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              Built for how people actually eat.
            </h2>
            <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-[#B9C2B7]">
              Most food databases are built around packaged products with
              barcodes. Home-cooked meals, thalis, mixed curries, and &quot;a
              bit of everything&quot; plates don&apos;t fit that mold — so they
              usually get logged badly, or not at all. NutriAI reasons about the
              whole meal at once, instead of making you search for and add each
              ingredient individually.
            </p>
          </div>
          <div className="space-y-3">
            {[
              "2 idlis, sambar, coconut chutney",
              "chicken shawarma wrap, no fries",
              "leftover pasta, small portion, extra parmesan",
              "bowl of oats with banana and peanut butter",
            ].map((meal) => (
              <div
                key={meal}
                className="rounded-sm border border-[#2B3A31] bg-[#1B2820] px-4 py-3 text-sm text-[#B9C2B7]"
              >
                {meal}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="start"
        className="border-t border-[#2B3A31] px-6 py-24 md:px-10"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className="text-3xl text-[#EFE9DC] md:text-4xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            Your next meal takes five seconds to log.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[1.05rem] text-[#B9C2B7]">
            Free to start. No card required.
          </p>

          <Show when="signed-out">
            <SignUpButton>
              <button className="mt-8 inline-block rounded-sm bg-[#DDA53B] px-7 py-3 text-sm font-medium text-[#16211B] transition-colors hover:bg-[#e8b657]">
                Create your account
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <a
              href="/logging"
              className="mt-8 inline-block rounded-sm bg-[#DDA53B] px-7 py-3 text-sm font-medium text-[#16211B] transition-colors hover:bg-[#e8b657]"
            >
              Log a meal now
            </a>
          </Show>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2B3A31] px-6 py-10 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-[#7C9885] md:flex-row">
          <span style={{ fontFamily: "var(--font-display)" }}>NutriAI</span>
          <span>Built by one person, for people who stopped logging.</span>
        </div>
      </footer>
    </div>
  );
}
