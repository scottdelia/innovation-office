import { BETS, BUILD_ORDER, OPERATING_NOTES, THESIS } from '../content/bets';
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
          Three AI ideas for a life insurance brokerage. Here is what the
          numbers said.
        </h1>
        <p className="mt-4 text-lead text-ink-muted">
          Each is a working tool you can click, with the arithmetic behind it.
          None came back the way I expected, and each one ended pointing at
          something cheaper worth building instead. About a day per answer.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-title font-extrabold text-ink-strong">
          The three questions
        </h2>
        <p className="mt-1.5 text-sm text-ink-muted">
          {killed} of the {BETS.length} obvious builds did not survive contact
          with the arithmetic. Each one names its replacement.
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

      {/* What happens next, which the page did not say at all. Three measured
          verdicts and no plan reads as an audit rather than as someone who
          would go on to build the thing that survived. */}
      <section className="mt-14">
        <h2 className="text-title font-extrabold text-ink-strong">
          What I would build next, and in what order
        </h2>
        <p className="mt-1.5 max-w-3xl text-sm text-ink-muted">
          Everything above rests on numbers I invented. The first job is
          replacing them with measured ones, and the second is shipping the one
          thing that survived. Each step says what it depends on, so none of it
          is a promise I could keep on my own.
        </p>

        <ol className="mt-6 space-y-px overflow-hidden border border-line">
          {BUILD_ORDER.map((step, index) => (
            <li
              key={step.title}
              className="flex flex-col gap-x-8 gap-y-3 bg-surface p-5 sm:flex-row"
            >
              <div className="sm:w-40 sm:shrink-0">
                <p className="gauge-label text-accent">{step.when}</p>
                <p className="readout mt-1 text-2xl text-ink-faint">
                  {String(index + 1).padStart(2, '0')}
                </p>
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-extrabold text-ink-strong">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {step.body}
                </p>
                <p className="mt-2.5 text-xs leading-relaxed text-ink-subtle">
                  <span className="gauge-label">Needs</span>{' '}
                  <span className="ml-1">{step.needs}</span>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14">
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
