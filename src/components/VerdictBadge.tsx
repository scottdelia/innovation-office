import type { CSSProperties } from 'react';
import type { Verdict } from '../content/bets';

/**
 * A bet's disposition, as a chip.
 *
 * KILL IS NOT STYLED AS A FAILURE
 * -------------------------------
 * The obvious treatment is green for scale and red for kill, and it is wrong.
 * The brief this portfolio answers measures success partly as "ideas that were
 * correctly killed before consuming real resources". A kill is a successful
 * outcome of the process, and colouring it as an error teaches the opposite
 * lesson to the one the page exists to make.
 *
 * So kill and de-scope get the neutral ink treatment: definite, unmissable, and
 * not alarming. Red is reserved for nothing on this page, because nothing on
 * this page went wrong.
 */

// Plain words, not product-management vocabulary. "De-scope" told a reader
// familiar with the term that most of an idea died and a piece survived. It
// told everyone else nothing at all.
const VERDICT_STYLES: Record<
  Verdict,
  { label: string; tier: string; solid?: boolean }
> = {
  scale: { label: 'Build it', tier: 'var(--tier-preferred-plus)', solid: true },
  iterate: { label: 'Not yet', tier: 'var(--tier-standard-plus)', solid: true },
  de_scope: { label: 'Mostly killed', tier: 'var(--ink-subtle)' },
  kill: { label: 'Killed', tier: 'var(--ink-subtle)' },
  pending: { label: 'Undecided', tier: 'var(--ink-faint)' },
};

export function VerdictBadge({
  verdict,
  size = 'sm',
}: {
  verdict: Verdict;
  size?: 'sm' | 'lg';
}) {
  const config = VERDICT_STYLES[verdict];
  const style = { '--tier': config.tier } as CSSProperties;

  return (
    <span
      className={`tier-chip ${
        size === 'lg' ? 'px-3 py-1 text-[0.8125rem]' : ''
      }`}
      style={style}
    >
      <span className="tier-dot" style={style} />
      {config.label}
    </span>
  );
}
