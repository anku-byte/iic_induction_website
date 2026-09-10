import { Navbar } from "@/components/navbar";
import { Starfield } from "@/components/starfield";
import { RocketIllustration } from "@/components/rocket-illustration";
import { Rocket } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <Starfield />
      <Navbar />

      <main className="relative z-10">
        {/* Hero Section - Full viewport centered */}
        <section className="flex min-h-screen flex-col items-center justify-center px-6 pt-16 pb-12">
          {/* Top badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 backdrop-blur-sm">
            <Rocket className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Orientation 2026
            </span>
          </div>

          {/* Title */}
          <h1 className="text-balance mb-4 text-center text-4xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            Idea Innovation Cell
          </h1>
          <p className="mb-2 text-center font-mono text-sm tracking-[0.3em] uppercase text-muted-foreground sm:text-base">
            Welcome Aboard
          </p>
          <p className="mb-12 max-w-md text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
            Join the Idea Innovation Cell and be a part of a community that
            turns bold ideas into reality. Register now to get started.
          </p>

          {/* Rocket */}
          <div className="mb-12">
            <RocketIllustration />
          </div>

          {/* Register CTA */}
          <div>
            <Link
              href="/register"
              className="inline-flex items-center gap-3 rounded-lg border border-border bg-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest text-background transition-colors hover:bg-foreground/90"
            >
              <Rocket className="h-4 w-4" />
              Register Now
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border px-6 py-8">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-3">
              <Rocket className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Idea Innovation Cell
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Idea Innovation Cell. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
