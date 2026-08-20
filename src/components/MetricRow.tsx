import type { MeasuredMetric, MetricSource } from '../content/bets';

/**
 * One measured number, with its provenance on screen.
 *
 * The number leads. It is set large, monospaced, and in the signal colour when
 * a run produced it, because a page whose argument is "here is what I measured"
 * should not render the measurement at label size. The name sits above it as a
 * gauge label; the caveat sits under it.
 *
 * The source tag is the other point of this component. An eval result and a
 * back-of-envelope estimate set in the same typeface, with nothing separating
 * them, ask the reader to take the weaker one on the strength of the stronger.
 *
 * The weakest metric in a set is marked rather than buried. A results table
 * that only reads well is a table nobody should believe.
 */

const SOURCE_LABELS: Record<MetricSource, string> = {
  eval_run: 'eval run',
  instrumented: 'instrumented',
  estimated: 'estimate',
};

/** Only a number a run produced gets the signal colour. */
const MEASURED: MetricSource[] = ['eval_run', 'instrumented'];

export function MetricRow({ metric }: { metric: MeasuredMetric }) {
  const live = MEASURED.includes(metric.source);
  return (
    <div
      className={`border-b border-line py-4 last:border-b-0 ${
        metric.weakest ? 'tier-rail -ml-4 pl-4' : ''
      }`}
      style={
        metric.weakest
          ? ({ '--tier': 'var(--tier-table-rated)' } as React.CSSProperties)
          : undefined
      }
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="gauge-label">{metric.name}</span>
        {metric.weakest && (
          <span className="gauge-label text-warn">holds this back</span>
        )}
      </div>

      <div className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className={`readout readout-md ${live ? 'readout-live' : ''}`}>
          {metric.value}
        </span>
        <span className="rounded bg-surface-inset px-1.5 py-0.5 font-mono text-[0.625rem] tracking-tight text-ink-faint">
          {SOURCE_LABELS[metric.source]}
        </span>
      </div>

      {metric.detail && (
        <p className="mt-1.5 text-xs leading-relaxed text-ink-subtle">
          {metric.detail}
        </p>
      )}
    </div>
  );
}
