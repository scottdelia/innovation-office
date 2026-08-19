/**
 * The portfolio's content, kept as data rather than as prose in a component.
 *
 * Two reasons. The obvious one is that a bet card and a bet one-pager render the
 * same facts at different depths, and a fact written twice is a fact that will
 * disagree with itself. The less obvious one is that keeping it typed forces
 * every number on this site to declare where it came from: `MeasuredMetric`
 * cannot be constructed without a `source`, and `RoiInput` cannot be constructed
 * without a `basis`. A page that reports an eval result and a back-of-envelope
 * guess in the same typeface, without saying which is which, is not being
 * honest with the reader — and the type system is a cheaper way to enforce that
 * than remembering.
 */

/**
 * Where a number came from.
 *
 * `eval_run` is a committed, reproducible result. `instrumented` was measured by
 * the running code. `estimated` is a judgement, and is styled so it can never be
 * mistaken for the other two.
 */
export type MetricSource = 'eval_run' | 'instrumented' | 'estimated';

export interface MeasuredMetric {
  name: string;
  value: string;
  /** Variance, range, or sample size. The number alone is half a result. */
  detail?: string;
  source: MetricSource;
  /** Set when this is the number that holds the bet back. */
  weakest?: boolean;
}

/**
 * The provenance of an ROI input.
 *
 * `guess` is a real and permitted value. An ROI model with no guesses in it is
 * either trivial or dishonest; the point is that the reader can see which lines
 * are load-bearing before they believe the total.
 */
export type InputBasis = 'measured' | 'industry_assumption' | 'guess';

export interface RoiInput {
  name: string;
  value: string;
  basis: InputBasis;
  note?: string;
}

export interface RoiModel {
  /** The lever, in one sentence. */
  lever: string;
  /** The arithmetic, written out. */
  formula: string;
  inputs: RoiInput[];
  /** What would have to be true for this to be wrong. */
  caveat: string;
}

/**
 * A bet's disposition.
 *
 * `pending` is not a placeholder for laziness -- it is the correct state for a
 * bet whose kill criterion has been registered and whose evidence has not been
 * gathered. Recording a verdict before the work would be the thing this whole
 * exercise exists to avoid.
 */
export type Verdict = 'scale' | 'iterate' | 'de_scope' | 'kill' | 'pending';

export interface BetLink {
  label: string;
  href: string;
  /** The primary link gets the filled treatment; the rest are quiet. */
  primary?: boolean;
}

export interface Bet {
  id: string;
  index: number;
  title: string;
  /** One line, for the card. */
  summary: string;
  status: 'shipped' | 'scoped';
  /** The problem in an agent's or the brief's words, not in product language. */
  problem: string;
  problemAttribution: string;
  /** The falsifiable claim. */
  hypothesis: string;
  built?: string[];
  metrics?: MeasuredMetric[];
  cost?: { hours: string; api: string; note: string };
  roi?: RoiModel[];
  verdict: Verdict;
  verdictRationale: string;
  /** What evidence would move the verdict. Registered ahead of the evidence. */
  wouldChangeIt: string;
  /**
   * For a bet that has not been built: the result that kills it, written down
   * before building. The point of pre-registering is that a disappointing
   * number cannot be quietly reinterpreted as an encouraging one afterwards.
   */
  killCriterion?: string;
  links?: BetLink[];
}

export const THESIS = {
  headline: 'Synthetic ground truth is how you evaluate AI on a messy problem before you have clean data.',
  body: [
    'Every bet here is scored against data generated from a known structured source. The corpus is rendered from it, so the right answer is known exactly — down to the cell and the page it printed on. Accuracy becomes something measured rather than spot-checked, and a scorer that cannot fail is caught by a negative control.',
    'That matters because the honest constraint on this kind of work is rarely the model. It is that nobody can tell you whether the output is right, and the ground truth to check it against does not exist yet. Generating the ground truth is how you start measuring on day one instead of month six.',
  ],
};

export const OPERATING_NOTES = [
  {
    title: 'A kill criterion before the build, not after',
    body: 'Each unbuilt bet carries the result that ends it, written down in advance. A criterion set afterwards is an opinion; set beforehand it is a decision, and it stops a disappointing number being reinterpreted as an encouraging one.',
  },
  {
    title: 'Every number says where it came from',
    body: 'An eval result, an instrumented measurement, and an estimate are three different kinds of claim. They are tagged on this page so the reader can weigh them separately, rather than being asked to trust a total.',
  },
  {
    title: 'The failures are the argument',
    body: 'The weakest metric in each bet is called out rather than buried. A portfolio that only shows the happy path is asking to be taken on faith, which is exactly what a measured result is supposed to replace.',
  },
];

export const BETS: Bet[] = [
  {
    id: 'underwriting-copilot',
    index: 1,
    title: 'Underwriting Copilot',
    summary:
      'Cross-carrier rate class comparison from a plain-language prospect, with the guideline text and page behind every claim.',
    status: 'shipped',
    problem:
      'No single carrier guide answers the question. Each one names its rate classes differently and puts its A1c and build limits somewhere else, so placing a case means reading four documents and holding four vocabularies at once. In practice agents guess, ask a colleague who has written the case before, or submit and find out.',
    problemAttribution: 'The gap this bet was built against',
    hypothesis:
      'If an agent can see every carrier’s likely class in one place with the guideline text behind it, quote accuracy rises and declines fall — and a new agent stops needing two years of tribal knowledge to place a diabetic case.',
    built: [
      'Four synthetic carrier guides rendered from structured data, so extraction ground truth is exact down to the cell and the page',
      'Vision-based table extraction into SQLite, kept separate from prose chunking because a build chart run through a text chunker returns confidently wrong weight limits',
      'A router that answers three of four query types without a synthesis call — a published build limit read from the table is the number, not a number that might be right',
      'Citation verification that discards any claim whose quoted text is not in the evidence supplied, and downgrades a verdict to abstention when that empties its support',
      'A 50-item eval run three times, with a negative control proving the scorer can fail',
    ],
    metrics: [
      {
        name: 'Verdict accuracy',
        value: '91.4%',
        detail: '89.4–93.9 across 3 runs · σ 2.32',
        source: 'eval_run',
      },
      {
        name: 'Retrieval hit rate',
        value: '100%',
        detail: 'no variance across 3 runs',
        source: 'eval_run',
      },
      {
        name: 'Citation correctness',
        value: '99.9%',
        detail: 'checked against the PDF, not against what the pipeline believed it sent',
        source: 'eval_run',
      },
      {
        name: 'Refusal on out-of-corpus',
        value: '83.3%',
        detail: '75–87.5 across 3 runs · σ 7.22 — a 12-point spread on 8 items',
        source: 'eval_run',
        weakest: true,
      },
      {
        name: 'Hallucinated citations',
        value: '0.33 per run',
        detail: 'caught by verification and reported, never rendered',
        source: 'eval_run',
      },
      {
        name: 'Table extraction accuracy',
        value: '100%',
        detail: 'all 625 build-chart cells, not a sample · 0 fabricated rows',
        source: 'eval_run',
      },
      {
        name: 'Latency',
        value: '10.1s P50 · 17.8s P95',
        detail: 'four carriers synthesised concurrently',
        source: 'eval_run',
      },
    ],
    cost: {
      hours: 'Not instrumented',
      api: '$0.64 measured on ingestion',
      note: 'Spend is instrumented on the path that runs once and not on the path that runs thousands of times a day. That is backwards, it is the sharpest criticism I have of my own build, and it is written up rather than left out.',
    },
    roi: [
      {
        lever: 'Placement rate — cases that come back rated or declined after being quoted at a class the carrier would not have offered.',
        formula:
          'agents × cases per agent per year × decline rate attributable to misjudged class × average first-year commission',
        inputs: [
          {
            name: 'Producing agents',
            value: 'Business input',
            basis: 'guess',
            note: 'Quility publishes "thousands"; the model needs the real producing count, not the licensed count.',
          },
          {
            name: 'Decline rate from a misjudged class',
            value: 'Business input',
            basis: 'guess',
            note: 'The one number that decides whether this bet is worth anything. It should come from placement data, not from me.',
          },
          {
            name: 'Verdict accuracy on the indexed corpus',
            value: '91.4%',
            basis: 'measured',
            note: 'On a synthetic corpus. Real guides will be lower until the extraction is reviewed.',
          },
        ],
        caveat:
          'This is worth nothing if declines are driven by disclosure and lab results rather than by class misjudgement at quote time. That is checkable against placement data before a line of further code is written, and it should be checked first.',
      },
      {
        lever: 'New-agent ramp — the months before an agent has absorbed enough carrier-specific knowledge to place a case without asking.',
        formula:
          'new agents per year × months of ramp removed × monthly contribution per producing agent',
        inputs: [
          {
            name: 'New agents onboarded per year',
            value: 'Business input',
            basis: 'guess',
          },
          {
            name: 'Ramp months removed',
            value: 'Unknown',
            basis: 'guess',
            note: 'Not estimable from a demo. It needs a cohort comparison between agents with and without the tool.',
          },
        ],
        caveat:
          'Ramp reduction is the most attractive line in this model and the least evidenced. I would not put a number on it before running a cohort test.',
      },
    ],
    verdict: 'iterate',
    verdictRationale:
      'The retrieval and citation machinery holds: retrieval hit rate is 100%, citation correctness is 99.9% checked independently against the source PDF, and fabricated citations are caught rather than rendered. Two things stop it going further. Refusal on out-of-corpus questions is 83.3% with a 12-point spread across three runs, which is not a boundary I would put in front of a producing agent. And the eval labels have never been reviewed by a human — they are computed by an oracle written by the same person as the prompt, from the same documents, so the two could be wrong together.',
    wouldChangeIt:
      'Refusal above 95% with a spread under 5 points across five runs, plus a human-reviewed label set. Then carrier permission and a versioned document feed before it touches a real case, because a guide that changed last week against an index built last month produces a confidently wrong answer with a correct-looking citation.',
    links: [
      {
        label: 'Live demo',
        href: 'https://scottdelia.github.io/underwriting-copilot/',
        primary: true,
      },
      {
        label: 'Source',
        href: 'https://github.com/scottdelia/underwriting-copilot',
      },
      {
        label: 'Findings write-up',
        href: 'https://github.com/scottdelia/underwriting-copilot/blob/main/docs/FINDINGS.md',
      },
    ],
  },

  {
    id: 'agent-onboarding',
    index: 2,
    title: 'Agent Onboarding Copilot',
    summary:
      'Where the days actually go between a signed agent and a first submitted case — and which of them a model can remove. The answer is almost none of them.',
    status: 'shipped',
    problem:
      'An agent onboarding workflow that takes days and involves too many manual handoffs. What if it took hours?',
    problemAttribution: 'Named in the role brief',
    hypothesis:
      'The obvious build is a model that reads the licensing paperwork. I thought that build was close to worthless and that the interesting version of this bet was proving it. The claim: the bottleneck is not parsing but waiting — state licence verification, a background vendor, and a per-carrier appointment queue that no model shortens. Extraction moves total elapsed time by under 10%, and the real lever is catching a defective packet before it enters a carrier queue.',
    built: [
      'A twelve-agent synthetic cohort with per-step touch time and wait time kept separate — the instrument the whole bet turns on, built before any model call',
      'A critical-path model, because a background check and a licence lookup run concurrently and summing both overstates the timeline badly',
      'A deterministic gap engine checking every packet against each target carrier’s requirements, with no model in it at all',
      'Vision extraction with per-field provenance, every field nullable, and excerpts verified against the document’s own text layer',
      'A negative control proving the extraction scorer can fail',
    ],
    metrics: [
      {
        name: 'Extraction’s share of elapsed onboarding time',
        value: '0.1%',
        detail: 'against a 10% kill threshold registered before the build',
        source: 'eval_run',
        weakest: true,
      },
      {
        name: 'Time in external queues (carrier / state / vendor)',
        value: '93.9%',
        detail: 'of a 15.2-day mean, along the critical path',
        source: 'eval_run',
      },
      {
        name: 'Time with someone actively working',
        value: '0.3%',
        detail: '1.0h of 365.6h — the only part extraction can touch',
        source: 'eval_run',
      },
      {
        name: 'Rule engine vs extraction',
        value: '22× more',
        detail: 'elapsed time removed by catching defects before a carrier queue',
        source: 'eval_run',
      },
      {
        name: 'Gap engine precision / recall',
        value: '100% / 100%',
        detail: '8 planted defects, 12 agents, variance 0.00 (deterministic)',
        source: 'eval_run',
      },
      {
        name: 'Extraction field accuracy',
        value: '100%',
        detail: '96 field values, 0 confident-wrong — a ceiling on clean PDFs, not a forecast',
        source: 'eval_run',
      },
    ],
    cost: {
      hours: 'Not instrumented',
      api: '$0.39 total',
      note:
        'The two components that produced the finding — the cycle-time model and the gap engine — cost nothing to run, because neither calls a model. That is the economic version of the same point: the cheapest thing in the project is the thing that decided it.',
    },
    roi: [
      {
        lever:
          'Rework prevention — a packet defect caught at submission instead of by a carrier, which costs a full round trip through their queue rather than minutes.',
        formula:
          'agents onboarded per year × share whose packet bounces × days lost per bounce × cost of a day of delayed activation',
        inputs: [
          {
            name: 'Elapsed time lost to one bounced packet',
            value: '96h (19% of that agent’s total)',
            basis: 'measured',
            note: 'Measured in the cohort model for the agent carrying a legal-name mismatch.',
          },
          {
            name: 'Share of packets that bounce',
            value: 'Business input',
            basis: 'guess',
            note: 'One agent in twelve here is my assumption, not an observation. This is the number that sizes the whole lever and it should come from contracting data.',
          },
          {
            name: 'Cost of a day of delayed activation',
            value: 'Business input',
            basis: 'guess',
          },
        ],
        caveat:
          'This is worth nothing if packets rarely bounce, or if the common bounce reason is something a completeness check cannot see — a background result, say, rather than a data defect. Both are checkable against contracting records before another line is written.',
      },
    ],
    verdict: 'de_scope',
    verdictRationale:
      'The kill criterion fired, and not narrowly: extraction removes 0.1% of elapsed time against a 10% threshold, and it still fires with carrier queues cut to a quarter. Someone actively working is 0.3% of a 15.2-day onboarding, so no accuracy figure makes “days into hours” available. The framing dies. What survives is in the same data — the deterministic completeness check removes 22× more elapsed time than extraction and has no model in it, and a nudge queue recovers idle time that belongs to nobody. Extraction was built anyway and is trustworthy on its own terms (100% on 96 field values, zero confident-wrong), which answers a different question: it can accelerate review, not compress the timeline.',
    wouldChangeIt:
      'The real touch-versus-wait split from the workflow system, and the real rework rate from contracting data. The conclusion survives large errors in the assumed durations, but it is still a model, and those two numbers are what would move it. Nothing about extraction accuracy would — that is the point of the finding.',
    links: [
      {
        label: 'Source',
        href: 'https://github.com/scottdelia/onboarding-copilot',
        primary: true,
      },
      {
        label: 'Findings write-up',
        href: 'https://github.com/scottdelia/onboarding-copilot/blob/main/docs/FINDINGS.md',
      },
    ],
  },

  {
    id: 'call-coaching',
    index: 3,
    title: 'Call Coaching',
    summary:
      'Whether an LLM rubric over call transcripts measures selling skill, or measures knowing how the call ended.',
    status: 'scoped',
    problem:
      'Agents close some calls and lose others for reasons that are rarely documented. What if an AI layer could identify the patterns and turn them into a coaching tool to actually move close rates?',
    problemAttribution: 'Named in the role brief',
    hypothesis:
      'Scoring transcripts against a rubric is the easiest demo on this list to build and the easiest to fool yourself with: an unvalidated rubric produces confident numbers that measure nothing, and it looks identical to one that works. The claim worth testing is not that a model can score a call — it plainly can — but that the score tracks selling behaviour rather than hindsight.',
    killCriterion:
      'Score every call twice: once with the outcome withheld, once with it revealed. If the scores move materially between the two, the rubric is reading the outcome rather than the behaviour, and the manager-facing dashboard dies — a tool that grades known-won calls higher teaches a rep nothing. Per-call review with verbatim quotes may still survive that; the aggregate scoreboard does not. Registered before building.',
    verdict: 'pending',
    verdictRationale:
      'No verdict yet. The leakage control is the first thing built, not the last, because it is the cheapest way to find out whether the rest of the bet is worth constructing.',
    wouldChangeIt:
      'The leakage delta, and one more thing the transcripts are designed to expose: one rubric dimension is generated with zero weight on the outcome. If the rollup correctly finds that dimension does not predict anything, the instrument can detect a null result — which is what has to be true before a positive finding from it means much.',
  },
];
