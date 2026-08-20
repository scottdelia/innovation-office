import type { Bet } from '../content/bets';
import { navigate } from '../router';
import { VerdictBadge } from './VerdictBadge';

/**
 * One bet, as a card on the portfolio page.
 *
 * The card carries the headline number and the verdict and stops. Everything
 * else, the arithmetic, the failure taxonomy, the full metric set, is a click
 * away on the one-pager. A card that tries to carry the whole case makes three
 * of them unreadable side by side, and the point of the portfolio view is that
 * three bets can be compared at all.
 *
 * A scoped bet shows its pre-registered kill criterion where a shipped bet shows
 * its headline result. That is the honest parallel: for work that has run, the
 * interesting thing is what it measured; for work that has not, the interesting
 * thing is what would stop it.
 */
export function BetCard({ bet }: { bet: Bet }) {
  const headline = bet.metrics?.find((metric) => !metric.weakest);
  const weakest = bet.metrics?.find((metric) => metric.weakest);

  return (
    <article className="card flex flex-col overflow-hidden transition-colors hover:border-line-strong">
      <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
        <div className="min-w-0">
          <p className="gauge-label">
            Bet {String(bet.index).padStart(2, '0')}
          </p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight text-ink">
            {bet.title}
          </h3>
        </div>
        <VerdictBadge verdict={bet.verdict} />
      </div>

      <p className="px-5 py-4 text-sm leading-relaxed text-ink-muted">
        {bet.summary}
      </p>

      {bet.status === 'shipped' && headline && (
        <dl className="mx-5 mb-5 grid grid-cols-2 gap-px overflow-hidden rounded border border-line bg-line">
          <div className="bg-surface-inset px-4 py-3.5">
            <dt className="gauge-label">{headline.name}</dt>
            <dd className="readout readout-live mt-2 text-2xl">
              {headline.value}
            </dd>
          </div>
          {weakest && (
            <div className="bg-surface-inset px-4 py-3.5">
              <dt className="gauge-label text-warn">{weakest.name}</dt>
              <dd className="readout mt-2 text-2xl text-ink-muted">
                {weakest.value}
              </dd>
            </div>
          )}
        </dl>
      )}

      {bet.status === 'scoped' && bet.killCriterion && (
        <div
          className="tier-rail mx-5 mb-4 rounded-r-lg bg-surface-inset py-3 pl-4 pr-3.5"
          style={{ '--tier': 'var(--tier-table-rated)' } as React.CSSProperties}
        >
          <p className="gauge-label">Kill criterion, registered first</p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
            {bet.killCriterion.split('.')[0]}.
          </p>
        </div>
      )}

      <div className="mt-auto border-t border-line px-5 py-3">
        <button
          type="button"
          onClick={() => navigate(bet.id)}
          className="group flex items-center gap-2 text-sm font-medium text-accent transition-opacity hover:opacity-80"
        >
          {bet.status === 'shipped' ? 'Read the result' : 'Read the scope'}
          <span
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </button>
      </div>
    </article>
  );
}
