import type { MeasuredMetric, MetricSource } from '../content/bets';

/**
 * One measured number, with its provenance on screen.
 *
 * The source tag is the point of this component. An eval result and a
 * back-of-envelope estimate set in the same typeface, with nothing to separate
 * them, ask the reader to take the weaker one on the strength of the stronger.
 * Tagging every number costs a few pixels and removes that.
 *
 * The weakest metric in a set is marked rather than buried. A results table that
 * only reads well is a table nobody should believe, and pointing at the number
 * that holds the bet back is the cheapest way to earn the rest of it.
 */

const SOURCE_LABELS: Record<MetricSource, string> = {
  eval_run: 'eval run',
  instrumented: 'instrumented',
  estimated: 'estimate',
};

export function MetricRow({ metric }: { metric: MeasuredMetric }) {
  return (
    <div
      className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line py-3 last:border-b-0 ${
        metric.weakest ? 'tier-rail -ml-4 pl-4' : ''
      }`}
      style={
        metric.weakest
          ? ({ '--tier': 'var(--tier-table-rated)' } as React.CSSProperties)
          : undefined
      }
    >
      <span className="min-w-0 flex-1 text-sm text-ink-muted">
        {metric.name}
        {metric.weakest && (
          <span className="ml-2 align-middle text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-warn">
            holds this back
          </span>
        )}
      </span>

      <span className="tabular text-sm font-semibold text-ink">
        {metric.value}
      </span>

      <span className="basis-full text-xs text-ink-faint sm:basis-auto sm:text-right">
        {metric.detail && <span className="mr-2">{metric.detail}</span>}
        <span className="rounded bg-surface-inset px-1.5 py-0.5 font-mono text-[0.6875rem] tracking-tight">
          {SOURCE_LABELS[metric.source]}
        </span>
      </span>
    </div>
  );
}
