import { BETS, OPERATING_NOTES, THESIS } from '../content/bets';
import { BetCard } from '../components/BetCard';

/**
 * The landing page: a thesis, three bets, and how the office decides.
 *
 * Ordered so the argument survives someone who only reads the top of the page.
 * The thesis comes first because it is the transferable idea; the bets come
 * second because they are the evidence for it; the operating notes come last
 * because they explain the method, which only matters to a reader who has
 * already decided the results are worth trusting.
 */
export function PortfolioView() {
  const shipped = BETS.filter((bet) => bet.status === 'shipped').length;

  return (
    <>
      <section className="max-w-3xl">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-accent">
          Innovation Office · portfolio
        </p>
        <h1 className="mt-3 text-display font-semibold text-ink">
          {THESIS.headline}
        </h1>
        {THESIS.body.map((paragraph) => (
          <p key={paragraph} className="mt-4 text-lead text-ink-muted">
            {paragraph}
          </p>
        ))}
      </section>

      <section className="mt-12">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2 className="text-title font-semibold text-ink">The bets</h2>
          <p className="text-sm text-ink-subtle">
            <span className="tabular">{shipped}</span> of{' '}
            <span className="tabular">{BETS.length}</span> built and measured ·
            the rest carry a kill criterion registered before the work
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {BETS.map((bet) => (
            <BetCard key={bet.id} bet={bet} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-title font-semibold text-ink">
          How a bet gets decided
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {OPERATING_NOTES.map((note) => (
            <div key={note.title} className="card p-5">
              <h3 className="text-sm font-semibold text-ink">{note.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {note.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
