import { SignUp } from "@clerk/nextjs";
import { Bot, FileText, Users } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Architecture Generation",
    description:
      "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description:
      "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileText,
    title: "Instant Spec Generation",
    description:
      "Export a complete Markdown technical spec directly from the canvas graph.",
  },
];

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-base flex font-sans">
      <div className="hidden lg:flex flex-col w-1/2 bg-surface border-r border-surface-border relative">
        <div className="absolute top-8 left-10 flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-brand flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-[#080809]">G</span>
          </div>
          <span className="text-copy-primary font-semibold text-sm">
            Ghost AI
          </span>
        </div>
        <div className="flex flex-col justify-center flex-1 px-14 max-w-lg">
          <h1 className="text-copy-primary text-4xl font-bold leading-tight mb-4">
            Design systems at the speed of thought.
          </h1>
          <p className="text-copy-muted text-sm leading-relaxed mb-10">
            Describe your architecture in plain English. Ghost AI maps it to a
            shared canvas your whole team can refine in real time.
          </p>
          <ul className="space-y-6">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-4 items-start">
                <div className="mt-0.5 h-9 w-9 rounded-full bg-accent-dim flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-brand" />
                </div>
                <div>
                  <p className="text-copy-primary font-semibold text-sm mb-0.5">
                    {title}
                  </p>
                  <p className="text-copy-muted text-xs leading-relaxed">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex w-full lg:w-1/2 items-center justify-center">
        <SignUp />
      </div>
    </div>
  );
}
