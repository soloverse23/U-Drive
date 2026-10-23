import { useTranslations } from "next-intl";
import { cx } from "./cx";

export interface Step {
  id: string;
  label: string;
}

/**
 * Progress stepper for onboarding and rent-to-own (spec §3.5): one bar per step.
 * Mobile shows bars plus "Step 2 of 5 · label"; desktop also labels every step.
 */
export function Stepper({
  steps,
  current,
  label,
}: {
  steps: Step[];
  current: number;
  label: string;
}) {
  const t = useTranslations("ui.stepper");
  const currentStep = steps[current];

  return (
    <div>
      <p className="text-body-sm text-fg-muted md:hidden">
        {t("progress", { current: current + 1, total: steps.length })}
        {currentStep && <span className="text-fg">{` · ${currentStep.label}`}</span>}
      </p>
      <ol aria-label={label} className="mt-3 flex gap-1 md:mt-0">
        {steps.map((step, index) => {
          const state = index < current ? "complete" : index === current ? "current" : "upcoming";
          return (
            <li
              key={step.id}
              aria-current={state === "current" ? "step" : undefined}
              className="min-w-0 flex-1"
            >
              <span
                className={cx(
                  "block h-1 rounded-pill",
                  state === "upcoming" ? "bg-border" : "bg-inverse-bg",
                )}
              />
              <span
                className={cx(
                  "mt-3 hidden text-body-sm md:block",
                  state === "current" ? "font-medium text-fg" : "text-fg-muted",
                )}
              >
                {step.label}
              </span>
              <span className="sr-only">{`${step.label}: ${t(state)}`}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
