import type { Bet } from '../content/bets';
import { navigate } from '../router';
import { VerdictBadge } from './VerdictBadge';

/**
 * One bet, as a card on the portfolio page.
 *
 * Question, then answer, then the one number that settles it. In that order
 * because a reader who has never seen this project needs to know what was
 * being asked before a percentage means anything to them. The earlier version
 * of this card led with a summary line and two unlabelled figures, and a
 * stranger could not tell what "0.1%" was 0.1% of.
 *
 * Everything else, the arithmetic, the failure list, the full set of numbers,
 * is a click away. A card that carries the whole case makes three of them
 * unreadable side by side, and comparing three bets is the point of the page.
 */
export function BetCard({ bet }: { bet: Bet }) {
  const headline = bet.metrics?.find((metric) => metric.weakest) ?? bet.metrics?.[0];

  return (
    <article className="card flex flex-col transition-colors hover:border-line-strong">
      <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-3">
        <p className="gauge-label">Bet {String(bet.index).padStart(2, '0')}</p>
        <VerdictBadge verdict={bet.verdict} />
      </div>

      <div className="px-5 py-5">
        <p className="gauge-label">The question</p>
        <h3 className="mt-2 text-lg leading-snug font-extrabold text-ink-strong">
          {bet.question}
        </h3>

        <p className="gauge-label mt-5">The answer</p>
        <p className="mt-2 text-sm leading-relaxed text-ink">{bet.answer}</p>
      </div>

      {/* The decision, not the post-mortem. Two of these three ended by
          redirecting rather than stopping, and a card that reports the death
          without the replacement reads as a refusal. */}
      <div
        className="mx-5 mb-5 border-l-[3px] px-4 py-3.5"
        style={{
          borderColor: 'var(--accent)',
          background: 'var(--accent-soft)',
        }}
      >
        <p className="gauge-label" style={{ color: 'var(--accent)' }}>
          What I would build
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink">
          {bet.recommendation}
        </p>
      </div>

      {/* The number that decided it, not the number that flatters it. */}
      {headline && (
        <div className="mx-5 mb-5 border-t border-line pt-4">
          <p className="gauge-label">{headline.name}</p>
          <p
            className={`readout mt-2 text-2xl ${
              headline.weakest ? 'text-warn' : 'readout-live'
            }`}
          >
            {headline.value}
          </p>
          {headline.detail && (
            <p className="mt-1.5 text-xs leading-relaxed text-ink-subtle">
              {headline.detail}
            </p>
          )}
        </div>
      )}

      <div className="mt-auto border-t border-line px-5 py-3">
        <button
          type="button"
          onClick={() => navigate(bet.id)}
          className="group flex items-center gap-2 text-sm font-bold text-accent transition-opacity hover:opacity-80"
        >
          How I know that
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
