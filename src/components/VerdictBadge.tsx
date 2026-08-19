import type { CSSProperties } from 'react';
import type { Verdict } from '../content/bets';

/**
 * A bet's disposition, as a chip.
 *
 * KILL IS NOT STYLED AS A FAILURE
 * -------------------------------
 * The obvious treatment is green for scale and red for kill, and it is wrong.
 * The brief this portfolio answers measures success partly as "ideas that were
 * correctly killed before consuming real resources" — a kill is a successful
 * outcome of the process, and colouring it as an error teaches the opposite
 * lesson to the one the page exists to make.
 *
 * So kill and de-scope get the neutral ink treatment: definite, unmissable, and
 * not alarming. Red is reserved for nothing on this page, because nothing on
 * this page went wrong.
 */

const VERDICT_STYLES: Record<
  Verdict,
  { label: string; tier: string; solid?: boolean }
> = {
  scale: { label: 'Scale', tier: 'var(--tier-preferred-plus)', solid: true },
  iterate: { label: 'Iterate', tier: 'var(--tier-standard-plus)', solid: true },
  de_scope: { label: 'De-scope', tier: 'var(--ink-subtle)' },
  kill: { label: 'Kill', tier: 'var(--ink-subtle)' },
  pending: { label: 'Verdict pending', tier: 'var(--ink-faint)' },
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
