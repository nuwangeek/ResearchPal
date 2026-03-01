export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-foreground/5 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <span className="text-lg font-semibold tracking-tight">
          ResearchPal
        </span>
        <a
          href="/app"
          className="rounded-full border border-foreground/20 px-4 py-2 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
        >
          Get Started
        </a>
      </div>
    </nav>
  );
}
