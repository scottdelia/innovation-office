import type { InputBasis, RoiModel } from '../content/bets';

/**
 * An ROI model with its workings visible.
 *
 * WHY THERE IS NO TOTAL
 * ---------------------
 * The tempting version of this component ends in a large dollar figure. It
 * would be fabricated. The inputs that decide it, how many producing agents
 * and what share of declines trace to a misjudged class, belong to the business and
 * are not mine to invent. A confident total built on invented inputs is exactly
 * the kind of number that gets a project funded and then quietly abandoned.
 *
 * So this renders the lever, the arithmetic, and every input tagged with where
 * it came from. `guess` is a permitted and expected value: a model with no
 * guesses is either trivial or lying about itself. What matters is that the
 * reader can see which lines are load-bearing before deciding whether to believe
 * the shape of it.
 *
 * The caveat is not a disclaimer. It names the condition under which the whole
 * lever is worth nothing, which is the part of a business case most likely to be
 * true and least likely to be written down.
 */

const BASIS_STYLE: Record<InputBasis, { label: string; tier: string }> = {
  measured: { label: 'measured', tier: 'var(--tier-preferred-plus)' },
  industry_assumption: {
    label: 'industry assumption',
    tier: 'var(--tier-standard-plus)',
  },
  guess: { label: 'needs a real number', tier: 'var(--tier-table-rated)' },
};

export function RoiPanel({ model }: { model: RoiModel }) {
  return (
    <div className="card overflow-hidden">
      <p className="border-b border-line px-5 py-3.5 text-sm leading-relaxed text-ink">
        {model.lever}
      </p>

      <div className="border-b border-line bg-surface-inset px-5 py-3">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-ink-faint">
          The arithmetic
        </p>
        <p className="mt-1.5 font-mono text-[0.8125rem] leading-relaxed text-ink-muted">
          {model.formula}
        </p>
      </div>

      <dl className="divide-y divide-line">
        {model.inputs.map((input) => {
          const basis = BASIS_STYLE[input.basis];
          return (
            <div key={input.name} className="px-5 py-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <dt className="text-sm text-ink-muted">{input.name}</dt>
                <dd className="flex items-center gap-2.5">
                  <span className="tabular text-sm font-semibold text-ink">
                    {input.value}
                  </span>
                  <span
                    className="tier-chip"
                    style={{ '--tier': basis.tier } as React.CSSProperties}
                  >
                    {basis.label}
                  </span>
                </dd>
              </div>
              {input.note && (
                <p className="mt-1.5 max-w-prose text-xs leading-relaxed text-ink-subtle">
                  {input.note}
                </p>
              )}
            </div>
          );
        })}
      </dl>

      <p className="border-t border-line bg-surface-inset px-5 py-3.5 text-xs leading-relaxed text-ink-subtle">
        <span className="font-semibold text-ink-muted">
          What would make this worth nothing:
        </span>{' '}
        {model.caveat}
      </p>
    </div>
  );
}
