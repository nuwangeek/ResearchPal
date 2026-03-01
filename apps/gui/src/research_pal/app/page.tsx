import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { FeatureCard } from "@/components/landing/feature-card";
import { Footer } from "@/components/landing/footer";
import {
  DocumentIcon,
  MicrophoneIcon,
  SparklesIcon,
} from "@/components/landing/icons";

const features = [
  {
    icon: <DocumentIcon className="h-6 w-6" />,
    title: "Smart Paper Curation",
    description:
      "Automated pipeline discovers and filters arXiv papers matching your research interests.",
  },
  {
    icon: <MicrophoneIcon className="h-6 w-6" />,
    title: "Voice-Based Chat",
    description:
      "Have natural voice conversations with selected papers. Ask questions, get explanations.",
  },
  {
    icon: <SparklesIcon className="h-6 w-6" />,
    title: "Swappable AI Providers",
    description:
      "Built on OpenAI, Anthropic, or Azure — choose the LLM that fits your needs.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <Hero />
      <section id="features" className="mx-auto max-w-5xl px-6 py-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-foreground/60">
            Three steps from paper overload to focused understanding.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
