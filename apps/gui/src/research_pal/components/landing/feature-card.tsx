interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-foreground/5 bg-foreground/[0.02] p-8 text-center dark:bg-foreground/[0.03]">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
        {icon}
      </div>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="text-sm leading-relaxed text-foreground/60">
        {description}
      </p>
    </div>
  );
}
