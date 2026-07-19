import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/queries";

const DEFAULTS = [
  { title: "Sourced in Kyoto", body: "From small family-run tea gardens." },
  { title: "Stone-milled slow", body: "Preserving vivid color and aroma." },
  { title: "Sealed in tins", body: "Freshness until your first bowl." },
];

export function StoryStrip() {
  const { data: s } = useQuery(settingsQuery);
  const steps = s?.story_steps?.length ? s.story_steps : DEFAULTS;

  return (
    <section className="container-soft pt-16">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-10">
        {steps.map((step, i) => (
          <div key={step.title + i} className="flex gap-4">
            <span className="font-serif text-3xl leading-none text-[color:var(--matcha)] md:text-4xl">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="font-serif text-lg text-[color:var(--forest)] md:text-xl">
                {step.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-[color:var(--forest)]/75">
                {step.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
