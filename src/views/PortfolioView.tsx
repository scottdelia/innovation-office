import { BETS, OPERATING_NOTES, THESIS } from '../content/bets';
import { BetCard } from '../components/BetCard';

/**
 * The landing page.
 *
 * Ordered for someone who has never seen this before and will give it thirty
 * seconds: what this is, then the three questions and what the answers turned
 * out to be, then how the answers were reached.
 *
 * The method used to open the page. It does not any more. "Synthetic ground
 * truth is how you evaluate AI on a messy problem" is true and means nothing
 * to a reader who has not yet been told what was built or why, and it was the
 * first thing on the page for a while.
 */
export function PortfolioView() {
  const killed = BETS.filter(
    (bet) => bet.verdict === 'de_scope' || bet.verdict === 'kill',
  ).length;

  return (
    <>
      <section className="max-w-3xl">
        <p className="gauge-label text-accent">Innovation Office · Scott Delia</p>
        <h1 className="mt-3 text-display font-extrabold text-ink-strong">
          Three AI ideas for Quility. I killed two of them.
        </h1>
        <p className="mt-4 text-lead text-ink-muted">
          Each one is a working tool you can click, with the arithmetic that
          decided its fate. The two I killed were killed on numbers I wrote down
          before I started building, in about a day each.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-title font-extrabold text-ink-strong">
          The three questions
        </h2>
        <p className="mt-1.5 text-sm text-ink-muted">
          {killed} of {BETS.length} came back as no. That is the useful part.
        </p>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {BETS.map((bet) => (
            <BetCard key={bet.id} bet={bet} />
          ))}
        </div>
      </section>

      {/* The method, placed after the results rather than before them. A
          reader who does not yet believe the numbers has no reason to care how
          they were produced. */}
      <section className="mt-14 max-w-3xl">
        <h2 className="text-title font-extrabold text-ink-strong">
          {THESIS.headline}
        </h2>
        {THESIS.body.map((paragraph) => (
          <p key={paragraph} className="mt-4 text-base leading-relaxed text-ink-muted">
            {paragraph}
          </p>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="text-title font-extrabold text-ink-strong">
          How I decided
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {OPERATING_NOTES.map((note) => (
            <div key={note.title} className="card p-5">
              <h3 className="text-sm font-bold text-ink-strong">{note.title}</h3>
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
