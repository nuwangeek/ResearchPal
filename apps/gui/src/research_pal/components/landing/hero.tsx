import { ArrowRightIcon } from "@/components/landing/icons";

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-16 text-center">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex max-w-2xl flex-col items-center gap-8">
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Curate, Understand, and Chat with Research Papers
        </h1>
        <p className="max-w-lg text-lg leading-relaxed text-foreground/60">
          An AI-powered assistant that surfaces the most relevant arXiv papers
          and lets you have voice conversations with them.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            href="/app"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Get Started
            <ArrowRightIcon className="h-4 w-4" />
          </a>
          <a
            href="#features"
            className="inline-flex items-center justify-center rounded-full border border-foreground/20 px-6 py-3 text-sm font-medium transition-colors hover:bg-foreground/5"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
