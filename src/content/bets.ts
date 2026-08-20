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
 * honest with the reader, and the type system is a cheaper way to enforce that
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
  headline:
    'Generate the ground truth, and you can measure on day one instead of month six.',
  body: [
    'Every corpus here is rendered from structured data, so the right answer is known exactly: the cell, the page, the turn. Accuracy is measured rather than spot-checked, and a scorer that cannot fail gets caught by a negative control.',
    'The constraint on this work is rarely the model. It is that nobody can tell you whether the output is right.',
  ],
};

export const OPERATING_NOTES = [
  {
    title: 'Kill criteria before the build',
    body: 'Each bet carried the number that would end it, written down first. Two of three were decided by it.',
  },
  {
    title: 'A criterion that holds is not a clean bill of health',
    body: 'Bet 3 passed its own test and was de-scoped by a second one. Pre-registration stops you moving the goalposts. It does not tell you whether you picked the right posts.',
  },
  {
    title: 'Every number says where it came from',
    body: 'An eval result, an instrumented measurement, and an estimate are three different claims. They are tagged, not blended into a total.',
  },
  {
    title: 'The weakest metric is on the card',
    body: 'Each bet surfaces the number that holds it back. A portfolio showing only the happy path is asking to be taken on faith.',
  },
];

export const BETS: Bet[] = [
  {
    id: 'underwriting-copilot',
    index: 1,
    title: 'Underwriting Copilot',
    summary:
      'Four carriers compared from one plain-language case, every claim traced to its page.',
    status: 'shipped',
    problem:
      'Placing a diabetic case means reading four carrier guides in four vocabularies. Agents guess, ask someone who has written it before, or submit and find out.',
    problemAttribution: 'The gap this bet was built against',
    hypothesis:
      'Put every carrier’s likely class in one place with the guideline text behind it, and quote accuracy rises while declines fall.',
    built: [
      'Four carrier guides rendered from structured data, so extraction truth is exact to the cell and page',
      'Build charts extracted as tables, never chunked as prose. A chunked weight limit is confidently wrong',
      'A router that answers three of four query types without a synthesis call',
      'Any claim whose quote is missing from the evidence is dropped. A verdict with no support left becomes an abstention',
      '50 items, 3 runs, plus a negative control proving the scorer can fail',
    ],
    metrics: [
      {
        name: 'Verdict accuracy',
        value: '91.4%',
        detail: '89.4 to 93.9 across 3 runs · σ 2.32',
        source: 'eval_run',
      },
      {
        name: 'Citation correctness',
        value: '99.9%',
        detail: 'checked against the PDF, not against what the pipeline thought it sent',
        source: 'eval_run',
      },
      {
        name: 'Table extraction',
        value: '100%',
        detail: 'all 625 build-chart cells, not a sample · 0 fabricated rows',
        source: 'eval_run',
      },
      {
        name: 'Refusal on out-of-corpus',
        value: '83.3%',
        detail: '75 to 87.5 across 3 runs · σ 7.22. A 12-point spread on 8 items',
        source: 'eval_run',
        weakest: true,
      },
      {
        name: 'Hallucinated citations',
        value: '0.33 / run',
        detail: 'caught by verification, never rendered',
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
      api: '$0.64 on ingestion',
      note: 'Measured on the path that runs once, not the one that runs all day. That is backwards, and it is the sharpest criticism I have of this build.',
    },
    roi: [
      {
        lever:
          'Cases quoted at a class the carrier would not have offered, and returned rated or declined.',
        formula:
          'agents × cases per agent per year × declines from a misjudged class × first-year commission',
        inputs: [
          {
            name: 'Producing agents',
            value: 'Business input',
            basis: 'guess',
            note: 'Quility publishes "thousands". The model needs the producing count, not the licensed count.',
          },
          {
            name: 'Declines from a misjudged class',
            value: 'Business input',
            basis: 'guess',
            note: 'The number that decides whether this bet is worth anything. It should come from placement data.',
          },
          {
            name: 'Verdict accuracy',
            value: '91.4%',
            basis: 'measured',
            note: 'On a synthetic corpus. Real guides will score lower until extraction is reviewed.',
          },
        ],
        caveat:
          'Worth nothing if declines come from disclosure and labs rather than class misjudgement at quote time. Checkable against placement data before another line is written.',
      },
      {
        lever: 'Months of ramp before a new agent can place a case without asking.',
        formula: 'new agents per year × ramp months removed × monthly contribution per agent',
        inputs: [
          { name: 'New agents per year', value: 'Business input', basis: 'guess' },
          {
            name: 'Ramp months removed',
            value: 'Unknown',
            basis: 'guess',
            note: 'Not estimable from a demo. Needs a cohort comparison.',
          },
        ],
        caveat:
          'The most attractive line in this model and the least evidenced. I would not put a number on it before a cohort test.',
      },
    ],
    verdict: 'iterate',
    verdictRationale:
      'Retrieval and citations hold. Two things stop it going further. Refusal on out-of-corpus questions is 83.3% with a 12-point spread across three runs, which is not a boundary to put in front of a producing agent. And no human has reviewed the eval labels: the oracle and the prompt share an author and a source, so both can be wrong together.',
    wouldChangeIt:
      'Refusal above 95% with a spread under 5 points over five runs, plus a human-reviewed label set. Then a versioned document feed, because a guide that changed last week against an index built last month answers confidently with a correct-looking citation.',
    links: [
      {
        label: 'Live demo',
        href: 'https://scottdelia.github.io/underwriting-copilot/',
        primary: true,
      },
      { label: 'Source', href: 'https://github.com/scottdelia/underwriting-copilot' },
      {
        label: 'Findings',
        href: 'https://github.com/scottdelia/underwriting-copilot/blob/main/docs/FINDINGS.md',
      },
    ],
  },

  {
    id: 'agent-onboarding',
    index: 2,
    title: 'Agent Onboarding',
    summary:
      'Where 15 days actually go, and how little of it a model can remove.',
    status: 'shipped',
    problem:
      'An agent onboarding workflow that takes days and involves too many manual handoffs. What if it took hours?',
    problemAttribution: 'Named in the role brief',
    hypothesis:
      'The obvious build reads the licensing paperwork. I thought that build was close to worthless, and that proving it was the interesting version of this bet. The bottleneck is waiting, not parsing.',
    built: [
      'A twelve-agent cohort with touch time and wait time kept separate. The instrument, built before any model call',
      'A critical-path model, because a background check and a licence lookup run concurrently and summing both overstates the timeline',
      'A deterministic gap engine checking each packet against carrier requirements, with no model in it',
      'Vision extraction with per-field provenance, every field nullable, excerpts verified against the document’s own text layer',
      'A negative control proving the extraction scorer can fail',
    ],
    metrics: [
      {
        name: 'What extraction removes',
        value: '0.1%',
        detail: 'against a 10% kill threshold registered before the build',
        source: 'eval_run',
        weakest: true,
      },
      {
        name: 'Time in external queues',
        value: '93.9%',
        detail: 'carrier, state, vendor. Of a 15.2-day mean, along the critical path',
        source: 'instrumented',
      },
      {
        name: 'Someone actively working',
        value: '0.3%',
        detail: 'about 68 minutes of 15.2 days',
        source: 'instrumented',
      },
      {
        name: 'What the rule engine removes',
        value: '22× more',
        detail: 'than extraction, with no model in it',
        source: 'instrumented',
      },
      {
        name: 'Gap detection',
        value: '100% / 100%',
        detail: 'precision and recall on 8 planted defects · variance 0.00',
        source: 'eval_run',
      },
      {
        name: 'Extraction accuracy',
        value: '100%',
        detail: '96 field values, 0 confident-wrong. A ceiling on clean generated PDFs, not a forecast',
        source: 'eval_run',
      },
    ],
    cost: {
      hours: '~11',
      api: '$0.39',
      note: 'The cycle-time model, which decided the bet, cost nothing. It has no model in it.',
    },
    roi: [
      {
        lever: 'Packets caught before they enter a carrier queue instead of bouncing back from one.',
        formula: 'packets per year × bounce rate × days per bounce × carrying cost of an idle agent',
        inputs: [
          { name: 'Contracting packets per year', value: 'Business input', basis: 'guess' },
          {
            name: 'Share bounced for a fixable defect',
            value: 'Business input',
            basis: 'guess',
            note: 'The load-bearing input. Contracting records have it.',
          },
          {
            name: 'Days lost per bounce',
            value: '7.4',
            basis: 'industry_assumption',
            note: 'Modelled from carrier SLAs, not observed.',
          },
        ],
        caveat:
          'Worth nothing if packets rarely bounce, or if the common reason is something a completeness check cannot see. Both checkable against contracting records.',
      },
    ],
    verdict: 'de_scope',
    verdictRationale:
      'The criterion fired, and not narrowly. Extraction removes 0.1% of elapsed time against a 10% threshold, and it still fires with carrier queues cut to a quarter. Someone actively working is 0.3% of a 15.2-day onboarding, so no accuracy figure makes "days into hours" available. What survives is in the same data: a deterministic completeness check removes 22× more, and it has no model in it.',
    wouldChangeIt:
      'The real touch-versus-wait split from the workflow system, and the real rework rate from contracting. Extraction accuracy would not move it. That is the finding.',
    links: [
      {
        label: 'Live demo',
        href: 'https://scottdelia.github.io/onboarding-copilot/',
        primary: true,
      },
      { label: 'Source', href: 'https://github.com/scottdelia/onboarding-copilot' },
      {
        label: 'Findings',
        href: 'https://github.com/scottdelia/onboarding-copilot/blob/main/docs/FINDINGS.md',
      },
    ],
  },

  {
    id: 'call-coaching',
    index: 3,
    title: 'Call Coaching',
    summary:
      'Does a rubric score selling skill, or knowing how the call ended?',
    status: 'shipped',
    problem:
      'Agents close some calls and lose others for reasons nobody writes down. What if AI could find the pattern and turn it into coaching?',
    problemAttribution: 'Named in the role brief',
    hypothesis:
      'A model can plainly score a call. The claim worth testing is that the score tracks behaviour rather than hindsight, because an unvalidated rubric produces confident numbers that measure nothing and looks identical to one that works.',
    killCriterion:
      'Score every call twice, outcome withheld then revealed, nothing else changed. If the scores move by 0.5 rubric levels or more, the rubric reads the outcome rather than the behaviour and the manager dashboard dies. Registered before building.',
    built: [
      'Sixty transcripts assembled from a line bank keyed by (dimension, level). The depicted level is the key that picked the line, not an estimate',
      'The turn index of every signal-carrying line recorded as it is placed, which makes quote attribution measurable',
      'A schema in which a score with no quote, or a dimension scored twice, cannot be parsed',
      'Quote verification against the transcript, withdrawing any score whose evidence is not there',
      'The leakage control: every call scored twice, hidden and revealed',
      'A permutation test, added after the bare ranking turned out to be the defect',
      'Six negative controls proving the verifier can fail, one of which caught a flaw in itself',
    ],
    metrics: [
      {
        name: 'Outcome-leakage shift',
        value: '0.25 levels',
        detail: 'against the 0.5 threshold registered first · signed shift +0.01',
        source: 'eval_run',
      },
      {
        name: 'Zero-weight dimension called a driver',
        value: 'Yes, 4th of 5',
        detail: 'above compliance language, which has real weight. p = 0.069, so noise',
        source: 'eval_run',
      },
      {
        name: 'Quote attribution',
        value: '93 to 100%',
        detail: 'on four of five dimensions. Rapport 74%. 0 scores withdrawn in 120 reviews',
        source: 'eval_run',
      },
      {
        name: 'Agreement with the planted level',
        value: '45.5% exact',
        detail: '85.4% within one level, n=45. Rapport worst at 30.2%',
        source: 'eval_run',
        weakest: true,
      },
      {
        name: 'Malformed responses re-asked',
        value: '14 of 134',
        detail: '10.4%. Without the retry the first full run died at call 15',
        source: 'instrumented',
      },
    ],
    cost: {
      hours: '~9',
      api: '$3.33',
      note: 'One 120-review sweep. A resume cache means an interrupted run does not re-bill, so the re-analysis that added the permutation test cost nothing.',
    },
    roi: [
      {
        lever: 'Coaching time spent coaching instead of hunting for the moment worth coaching.',
        formula: 'managers × hours/week listening × share that is search × loaded hourly cost × 52',
        inputs: [
          { name: 'Managers reviewing calls', value: 'Business input', basis: 'guess' },
          { name: 'Hours per week each spends listening', value: 'Business input', basis: 'guess' },
          {
            name: 'Share of that spent locating the moment',
            value: 'Business input',
            basis: 'guess',
            note: 'The only part the tool touches. Coaching time itself is not saved and should not be counted.',
          },
        ],
        caveat:
          'Worth nothing if managers are not listening to calls today. Then the tool creates work, and the case is a revenue argument needing an A/B test.',
      },
      {
        lever: 'Close-rate lift from coaching the three behaviours the rollup can actually detect.',
        formula: 'agents × quoted cases/month × close rate × lift × commission × 12',
        inputs: [
          { name: 'Producing agents', value: 'Business input', basis: 'guess' },
          { name: 'Baseline close rate', value: 'Business input', basis: 'guess' },
          {
            name: 'Lift from coaching',
            value: 'Unknown',
            basis: 'guess',
            note: 'The load-bearing input, and the one nothing here measures. Identifying a driver does not establish that coaching it changes behaviour.',
          },
        ],
        caveat:
          'Soft, and I would not put a number on it. The eval shows the rollup can find three real drivers. It says nothing about whether telling an agent moves their close rate.',
      },
    ],
    verdict: 'de_scope',
    verdictRationale:
      'The registered criterion held: scores shift 0.25 levels against a 0.5 threshold, so the rubric reads behaviour, not the result. A second check decided the bet. A dimension planted with zero weight ranked 4th of 5, above one with real weight. Not leakage, not the halo effect I assumed, just noise at p = 0.069. The defect was the rollup reporting five point estimates as a ranking with no uncertainty attached. So the bare ranking is dead, the rollup ships with a significance test, and the numeric scorecard waits for human labels. The per-call review survives on its evidence.',
    wouldChangeIt:
      'Thirty calls rated independently by two sales managers. Everything here is agreement with a generator, and it is the cheapest open item. Then the same rollup at n≈200, where compliance language becomes detectable. A better model would change nothing. The defect was in the reporting layer.',
    links: [
      {
        label: 'Live demo',
        href: 'https://scottdelia.github.io/coaching-copilot/',
        primary: true,
      },
      { label: 'Source', href: 'https://github.com/scottdelia/coaching-copilot' },
      {
        label: 'Findings',
        href: 'https://github.com/scottdelia/coaching-copilot/blob/main/docs/FINDINGS.md',
      },
    ],
  },
];
