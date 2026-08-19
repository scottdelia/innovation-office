import type { Bet } from '../content/bets';
import { MetricRow } from '../components/MetricRow';
import { RoiPanel } from '../components/RoiPanel';
import { VerdictBadge } from '../components/VerdictBadge';
import { navigate } from '../router';

/**
 * One bet at full depth.
 *
 * The order is the order a decision actually gets made in: the problem in the
 * words of whoever has it, the falsifiable claim, what was built, what it
 * measured, what it would be worth, and only then the verdict. Leading with the
 * verdict would invite the reader to check whether the evidence supports a
 * conclusion they have already been given, which is the wrong direction to read
 * a business case in.
 *
 * The verdict block always states what would change it. A verdict with no exit
 * condition is a position rather than a decision, and it is the thing that keeps
 * a dead project alive for another quarter.
 */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-ink-faint">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function BetView({ bet }: { bet: Bet }) {
  return (
    <article className="max-w-3xl">
      <button
        type="button"
        onClick={() => navigate('')}
        className="group flex items-center gap-2 text-sm text-ink-subtle transition-colors hover:text-ink"
      >
        <span
          aria-hidden
          className="transition-transform group-hover:-translate-x-0.5"
        >
          ←
        </span>
        All bets
      </button>

      <header className="mt-6">
        <p className="tabular text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
          Bet {bet.index}
          <span className="ml-2 font-medium normal-case tracking-normal">
            {bet.status === 'shipped' ? 'Shipped' : 'Scoped, not built'}
          </span>
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
          <h1 className="text-display font-semibold text-ink">{bet.title}</h1>
          <VerdictBadge verdict={bet.verdict} size="lg" />
        </div>
      </header>

      {bet.links && bet.links.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {bet.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              className={
                link.primary
                  ? 'rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-hover'
                  : 'rounded-lg border border-line bg-surface px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:border-line-strong hover:text-ink'
              }
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      <Section title="The problem">
        <blockquote
          className="tier-rail py-1 pl-4 text-lead text-ink-muted"
          style={{ '--tier': 'var(--accent)' } as React.CSSProperties}
        >
          {bet.problem}
        </blockquote>
        <p className="mt-2 pl-4 text-xs text-ink-faint">
          {bet.problemAttribution}
        </p>
      </Section>

      <Section title="The hypothesis">
        <p className="text-base leading-relaxed text-ink-muted">
          {bet.hypothesis}
        </p>
      </Section>

      {bet.built && (
        <Section title="What was built">
          <ul className="space-y-2.5">
            {bet.built.map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-2 size-1.5 shrink-0 rounded-full"
                  style={{ background: 'var(--accent)' }}
                />
                <span className="text-sm leading-relaxed text-ink-muted">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {bet.metrics && (
        <Section title="What it measured">
          <div className="card px-5 py-1">
            {bet.metrics.map((metric) => (
              <MetricRow key={metric.name} metric={metric} />
            ))}
          </div>
        </Section>
      )}

      {bet.cost && (
        <Section title="What it cost">
          <div className="card divide-y divide-line">
            <div className="flex flex-wrap gap-x-10 gap-y-3 px-5 py-4">
              <div>
                <p className="text-[0.6875rem] uppercase tracking-[0.06em] text-ink-faint">
                  Build hours
                </p>
                <p className="mt-1 text-base font-semibold text-ink">
                  {bet.cost.hours}
                </p>
              </div>
              <div>
                <p className="text-[0.6875rem] uppercase tracking-[0.06em] text-ink-faint">
                  API spend
                </p>
                <p className="tabular mt-1 text-base font-semibold text-ink">
                  {bet.cost.api}
                </p>
              </div>
            </div>
            <p className="px-5 py-3.5 text-xs leading-relaxed text-ink-subtle">
              {bet.cost.note}
            </p>
          </div>
        </Section>
      )}

      {bet.roi && bet.roi.length > 0 && (
        <Section title="What it would be worth">
          <div className="space-y-4">
            {bet.roi.map((model) => (
              <RoiPanel key={model.lever} model={model} />
            ))}
          </div>
        </Section>
      )}

      {bet.killCriterion && (
        <Section title="Kill criterion, registered before building">
          <div
            className="tier-rail card py-4 pl-5 pr-5"
            style={
              { '--tier': 'var(--tier-table-rated)' } as React.CSSProperties
            }
          >
            <p className="text-sm leading-relaxed text-ink-muted">
              {bet.killCriterion}
            </p>
          </div>
        </Section>
      )}

      <Section title="The verdict">
        <div className="card p-5">
          <div className="flex flex-wrap items-center gap-3">
            <VerdictBadge verdict={bet.verdict} size="lg" />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            {bet.verdictRationale}
          </p>
          <div className="mt-4 border-t border-line pt-4">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-ink-faint">
              What would change it
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
              {bet.wouldChangeIt}
            </p>
          </div>
        </div>
      </Section>
    </article>
  );
}
