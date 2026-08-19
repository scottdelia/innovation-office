import { BETS } from './content/bets';
import { useRoute, navigate } from './router';
import { ThemeToggle } from './components/ThemeToggle';
import { PortfolioView } from './views/PortfolioView';
import { BetView } from './views/BetView';

/**
 * The shell: header, routed body, footer.
 *
 * The design tokens in index.css are lifted verbatim from the Underwriting
 * Copilot rather than reimplemented, which is the whole reason they were written
 * as tokens. The two sites should look like one body of work with two front
 * doors, not like two projects that happen to share an author.
 */

/** Three bars for three bets, in ladder colours. Sibling to the Copilot mark. */
function Mark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className="size-8 shrink-0">
      <rect width="32" height="32" rx="8" fill="var(--ink)" />
      <rect
        x="7"
        y="8"
        width="18"
        height="3.5"
        rx="1.75"
        fill="var(--tier-preferred-plus)"
      />
      <rect
        x="7"
        y="14"
        width="13"
        height="3.5"
        rx="1.75"
        fill="var(--tier-standard-plus)"
      />
      <rect
        x="7"
        y="20"
        width="15"
        height="3.5"
        rx="1.75"
        fill="var(--tier-table-rated)"
      />
    </svg>
  );
}

export default function App() {
  const route = useRoute();
  const bet = BETS.find((candidate) => candidate.id === route);

  return (
    <div className="min-h-screen bg-surface-sunken">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-[72rem] items-center justify-between gap-4 px-5 py-3">
          <button
            type="button"
            onClick={() => navigate('')}
            className="flex min-w-0 items-center gap-2.5 text-left"
          >
            <Mark />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold tracking-tight text-ink">
                Innovation Office
              </span>
              <span className="block truncate text-xs text-ink-subtle">
                Applied AI portfolio · Scott Delia
              </span>
            </span>
          </button>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-[72rem] px-5 pb-20 pt-10">
        {/* An unknown hash is a mistyped or stale link, not an error worth a
            page of its own. It falls back to the portfolio, which is where the
            reader was trying to get to. */}
        {bet ? <BetView bet={bet} /> : <PortfolioView />}

        <footer className="mt-16 border-t border-line pt-5 text-xs leading-relaxed text-ink-faint">
          <p className="max-w-3xl">
            Every demo linked here runs on synthetic data. The carriers, the
            guidelines, the agents, and the transcripts are fabricated for
            demonstration and are labelled as such wherever they appear. Nothing
            here is affiliated with any insurance carrier, and nothing here is an
            offer, a quote, or underwriting advice.
          </p>
          <p className="mt-2">
            Built as a portfolio piece. The numbers on this site are tagged with
            where they came from.
          </p>
        </footer>
      </main>
    </div>
  );
}
