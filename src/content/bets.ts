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
  /**
   * The question a reader would actually ask, in their words.
   *
   * This and `answer` exist because the first version of these pages led with
   * a thesis and a hypothesis, and a reader who did not already know the
   * project could not tell what any of it was for. A page that opens with a
   * question someone has, and then answers it, does not need explaining.
   */
  question: string;
  /** The answer to `question`, in two sentences, with no jargon in them. */
  answer: string;
  /**
   * What to build instead, given that answer.
   *
   * Every one of these bets ended by redirecting rather than by stopping, and
   * the first version of these pages buried that. A card that says an idea is
   * dead and does not say what replaces it reads as a refusal, however good the
   * arithmetic behind it is.
   */
  recommendation: string;
  /** One line, for search results and link previews. */
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
  headline: 'You cannot grade an AI without an answer key.',
  body: [
    'So I wrote the answer key first. Every carrier, agent, and sales call on these pages is invented, generated from a spreadsheet where I already know every correct answer. Then I built the tool and scored it against that.',
    'That is why these pages can say "right 91% of the time" and show the working, instead of a demo that looks impressive and proves nothing.',
  ],
};

export const OPERATING_NOTES = [
  {
    title: 'I wrote down what would kill each idea before building it',
    body: 'Bet 2 had to save 10% of onboarding time or it was dead. It saved 0.1%. Deciding that in advance is what stops a bad number becoming an encouraging one.',
  },
  {
    title: 'Every no came with a cheaper yes',
    body: 'Neither of the two I killed ended in "nothing works". Both ended in "not that, this", and the replacement is on the card. Each answer took about a day, instead of a quarter of engineering.',
  },
  {
    title: 'Every number says where it came from',
    body: 'A tested result, a measurement taken while the code ran, and my own estimate are three different things. They are labelled, so you can weigh them separately.',
  },
  {
    title: 'Each card leads with its worst number',
    body: 'Not the one that flatters it. If you only read the front page you will still have seen the thing that holds each idea back.',
  },
];

/**
 * What the first quarter looks like.
 *
 * The pages before this one only evaluated. A portfolio that measures three
 * ideas and stops reads as a consultant's, and the role is not a consultant's.
 * Every item below is either replacing one of my guesses with a real number, or
 * building the thing that survived, and each says what it depends on so none of
 * it reads as a promise.
 */
export interface PlanStep {
  when: string;
  title: string;
  body: string;
  /** What this needs from Quility to be possible at all. */
  needs: string;
}

export const FIRST_90_DAYS: PlanStep[] = [
  {
    when: 'Weeks 1 to 2',
    title: 'Replace my three guesses with your three numbers',
    body: 'Every conclusion on this site rests on timings and rates I invented. Three of them decide everything: how much of onboarding is genuinely waiting, how often a contracting packet bounces and why, and whether declines trace back to a misjudged rate class at quote time. If the real numbers differ from mine, some of these verdicts flip, and I would rather find that out in week two than in month six.',
    needs: 'Read access to the onboarding workflow system, contracting records, and placement data.',
  },
  {
    when: 'Weeks 3 to 6',
    title: 'Ship the completeness check. There is no AI in it.',
    body: 'It was the largest measured lever in the whole exercise, at 22 times what the document reader saves. It is a rule engine over carrier requirements, so it needs no evaluation harness, no model spend, and no monitoring. It either matches the requirement or it does not.',
    needs: 'Current carrier requirement matrices, and someone in contracting to confirm the rules.',
  },
  {
    when: 'Weeks 7 to 12',
    title: 'Get 30 calls graded by two sales managers, independently',
    body: 'This is the blocker on everything in bet 3 and it is the cheapest item on the list. Right now the scoring is graded against an answer key I wrote, which tells you the tool is consistent and tells you nothing about whether it is right. Two managers grading the same 30 calls also tells you how much they disagree with each other, which is the real ceiling on any scoring tool.',
    needs: 'Thirty recorded calls, and about a day each from two managers.',
  },
  {
    when: 'Also weeks 7 to 12',
    title: 'Put the underwriting copilot in front of ten agents, behind a reviewer',
    body: 'It is right nine times in ten with the source on screen, which is a review accelerator rather than an answer. Ten agents and a licensed reviewer for a month produces the only number that matters: whether cases placed with it come back rated or declined less often than cases placed without it.',
    needs: 'Ten volunteer agents, one reviewer, and permission from the carriers whose guides get indexed.',
  },
  {
    when: 'Standing',
    title: 'No idea gets a sprint until it has a number that would kill it',
    body: 'Written down first, in one sentence, with a threshold. It costs an afternoon and it is the only reason two of these three were settled in a day each rather than a quarter each. It also removes the argument later, because the disappointing number cannot be reinterpreted as an encouraging one.',
    needs: 'Nothing. This is a habit, not a budget line.',
  },
];

export const BETS: Bet[] = [
  {
    id: 'underwriting-copilot',
    index: 1,
    title: 'Underwriting Copilot',
    question: 'Which carrier will actually write this case?',
    answer:
      'Nine times in ten it picks the right rate class, and every claim shows the guideline page it came from. It is not yet reliable enough at saying "I do not know".',
    recommendation:
      'Ship it as a tool for a reviewer, not as an answer. Nine in ten right with the source on screen makes a review faster today. Running unattended needs it to admit ignorance far more reliably than it currently does, and that is the one number to fix.',
    summary:
      'Four carriers compared from one plain-language case, every claim traced to its page.',
    status: 'shipped',
    problem:
      'An agent types a case in plain English. Today, answering it means reading four carrier guides that each name their rate classes differently and put the A1c and weight limits in a different place. So agents guess, ask someone who has written it before, or submit and find out.',
    problemAttribution: 'The gap this bet was built against',
    hypothesis:
      'Put every carrier’s likely answer in one place, with the guideline text behind it, and quote accuracy rises while declines fall.',
    built: [
      'Four invented carrier guides, printed as PDFs from a spreadsheet, so the correct answer for every cell and page is known in advance',
      'Height and weight charts read as tables, never as prose. Run a weight limit through a text splitter and it comes back confidently wrong',
      'Three of four question types answered by looking the number up, with no AI involved at all',
      'Every quote checked against the real document. If the quote is not there, the claim is dropped, and if that leaves nothing, the answer becomes "I do not know"',
      'The same 50 questions asked three times, plus a deliberately broken case to prove the grader can fail',
    ],
    metrics: [
      {
        name: 'Rate class picked correctly',
        value: '91.4%',
        detail: 'across 3 runs of the same 50 cases, worst run 89.4%',
        source: 'eval_run',
      },
      {
        name: 'Quotes that really appear in the guide',
        value: '99.9%',
        detail: 'checked against the PDF itself, not against what the code thought it sent',
        source: 'eval_run',
      },
      {
        name: 'Height and weight cells read correctly',
        value: '625 of 625',
        detail: 'every cell in the chart, not a sample. No invented rows',
        source: 'eval_run',
      },
      {
        name: 'Says "I do not know" when it should',
        value: '5 times in 6',
        detail: '83.3%, and it swung 12 points across three runs. This is what holds the bet back',
        source: 'eval_run',
        weakest: true,
      },
      {
        name: 'Made-up quotes caught before you see them',
        value: 'all of them',
        detail: 'about one per run is invented, checked, and dropped rather than shown',
        source: 'eval_run',
      },
      {
        name: 'Time to compare four carriers',
        value: '10 seconds',
        detail: 'typical. The slowest one in twenty takes 18',
        source: 'eval_run',
      },
    ],
    cost: {
      hours: 'Not tracked',
      api: '$0.64 to read the guides',
      note: 'I measured the cost of the step that runs once and not the step that would run thousands of times a day. That is backwards, and it is the sharpest criticism I have of this build.',
    },
    roi: [
      {
        lever:
          'Cases quoted at a class the carrier would never have offered, then returned rated or declined.',
        formula:
          'agents × cases each per year × share declined for a misjudged class × first-year commission',
        inputs: [
          {
            name: 'Producing agents',
            value: 'Your number',
            basis: 'guess',
            note: 'Quility publishes "thousands". The model needs the producing count, not the licensed count.',
          },
          {
            name: 'Share declined for a misjudged class',
            value: 'Your number',
            basis: 'guess',
            note: 'This one number decides whether the whole idea is worth anything. It is in your placement data, not in my head.',
          },
          {
            name: 'Rate class picked correctly',
            value: '91.4%',
            basis: 'measured',
            note: 'On invented guides. Real ones will score lower until someone checks the reading.',
          },
        ],
        caveat:
          'Worth nothing if declines come from disclosure and lab results rather than a misjudged class at quote time. Your placement data answers that before another line is written.',
      },
      {
        lever: 'Months a new agent spends learning which carrier takes which case.',
        formula: 'new agents per year × months of ramp removed × what a producing agent contributes monthly',
        inputs: [
          { name: 'New agents per year', value: 'Your number', basis: 'guess' },
          {
            name: 'Months of ramp removed',
            value: 'Unknown',
            basis: 'guess',
            note: 'Cannot be estimated from a demo. It needs two groups of new agents, one with the tool and one without.',
          },
        ],
        caveat:
          'The most attractive line here and the least evidenced. I would not put a number on it before running that comparison.',
      },
    ],
    verdict: 'iterate',
    verdictRationale:
      'The retrieval and the citations hold up. Two things stop it going further. It only says "I do not know" five times in six, and that number swung 12 points across three runs, which is not a boundary I would put in front of a producing agent. And no human has checked the answer key: I wrote both the grader and the tool, from the same documents, so both can be wrong in the same direction.',
    wouldChangeIt:
      'Getting the refusal rate above 19 in 20 and holding it steady across five runs, plus a second person checking the answer key. Then a feed that tracks guideline updates, because a guide that changed last week against an index built last month gives a confident wrong answer with a real-looking citation.',
    links: [
      {
        label: 'Try it',
        href: 'https://scottdelia.github.io/underwriting-copilot/',
        primary: true,
      },
      { label: 'Code', href: 'https://github.com/scottdelia/underwriting-copilot' },
      {
        label: 'Full write-up',
        href: 'https://github.com/scottdelia/underwriting-copilot/blob/main/docs/FINDINGS.md',
      },
    ],
  },

  {
    id: 'agent-onboarding',
    index: 2,
    title: 'Agent Onboarding',
    question: 'Onboarding takes 15 days. Could AI make it hours?',
    answer:
      'No. Out of those 15 days, someone is actually working for about 68 minutes. The rest is waiting on carriers, states, and a background check, and no model shortens a queue.',
    recommendation:
      'Build the checklist, not the document reader. Catching a bad packet before it reaches a carrier saves 22 times more time than AI reading it, costs nothing to run, and has no AI in it to go wrong.',
    summary:
      'Where 15 days actually go, and how little of it a model can remove.',
    status: 'shipped',
    problem:
      'An agent onboarding workflow that takes days and involves too many manual handoffs. What if it took hours?',
    problemAttribution: 'Named in the role brief',
    hypothesis:
      'The obvious build is an AI that reads the licensing paperwork. I thought that build was close to worthless, and that proving it was the interesting version of this bet. The delay is waiting, not reading.',
    built: [
      'Twelve invented agents going through onboarding, with time spent working and time spent waiting counted separately. Built before any AI, because it is the thing that answers the question',
      'A timeline that counts steps running side by side once instead of twice. A background check and a licence lookup happen at the same time, and adding them up doubles the answer',
      'A checklist that compares each agent’s paperwork to what each carrier requires. No AI in it anywhere',
      'AI document reading with every field allowed to come back empty, and every value checked against the text actually printed on the page',
      'A deliberately corrupted document, to prove the grader can fail',
    ],
    metrics: [
      {
        name: 'Time someone is actually working',
        value: '68 minutes',
        detail: 'out of 15.2 days. Everything else is a queue',
        source: 'instrumented',
      },
      {
        name: 'Time saved by AI reading the paperwork',
        value: '0.1%',
        detail: 'the idea needed 10% to be worth building. This is what killed it',
        source: 'eval_run',
        weakest: true,
      },
      {
        name: 'Time spent waiting on a carrier, a state, or a vendor',
        value: '93.9%',
        detail: 'of the 15.2 days, along the longest path through the process',
        source: 'instrumented',
      },
      {
        name: 'Time saved by the checklist instead',
        value: '22× more',
        detail: 'than the AI saves, and there is no AI in the checklist',
        source: 'instrumented',
      },
      {
        name: 'Missing paperwork caught before submission',
        value: '8 of 8',
        detail: 'no false alarms either, and the same result every run',
        source: 'eval_run',
      },
      {
        name: 'Fields read correctly off the documents',
        value: '96 of 96',
        detail: 'nothing read wrong-but-confident. On clean generated PDFs, so this is a ceiling',
        source: 'eval_run',
      },
    ],
    cost: {
      hours: '~11',
      api: '$0.39',
      note: 'The timeline model, which is the thing that answered the question, cost nothing. There is no AI in it.',
    },
    roi: [
      {
        lever: 'Paperwork fixed before it reaches a carrier instead of bouncing back from one.',
        formula: 'packets per year × share that bounce × days lost each time × what an idle agent costs you',
        inputs: [
          { name: 'Contracting packets per year', value: 'Your number', basis: 'guess' },
          {
            name: 'Share that bounce for something fixable',
            value: 'Your number',
            basis: 'guess',
            note: 'The number this rests on. Your contracting records have it.',
          },
          {
            name: 'Days lost per bounce',
            value: '7.4',
            basis: 'industry_assumption',
            note: 'Modelled from published carrier turnaround times, not observed at Quility.',
          },
        ],
        caveat:
          'Worth nothing if packets rarely bounce, or if they usually bounce for something a checklist cannot see, like a background result. Both are answerable from contracting records.',
      },
    ],
    verdict: 'de_scope',
    verdictRationale:
      'The test I set fired, and not narrowly. AI document reading saves 0.1% of the elapsed time against the 10% I said it needed, and it still fails even if carrier queues were four times faster than they are. Someone is actively working for 68 minutes of a 15-day process, so no accuracy figure makes "days into hours" available. What survives is in the same data: a plain checklist saves 22 times more time, and it has no AI in it at all.',
    wouldChangeIt:
      'Your real working-versus-waiting split from the workflow system, and your real bounce rate from contracting. Better AI reading would not move it. That is the finding.',
    links: [
      {
        label: 'Try it',
        href: 'https://scottdelia.github.io/onboarding-copilot/',
        primary: true,
      },
      { label: 'Code', href: 'https://github.com/scottdelia/onboarding-copilot' },
      {
        label: 'Full write-up',
        href: 'https://github.com/scottdelia/onboarding-copilot/blob/main/docs/FINDINGS.md',
      },
    ],
  },

  {
    id: 'call-coaching',
    index: 3,
    title: 'Call Coaching',
    question: 'Can AI tell a manager why a rep lost the call?',
    answer:
      'It can point at the exact line and explain it. It cannot yet put a trustworthy number on it: I ran the same test twice and the bottom of the leaderboard flipped.',
    recommendation:
      'Build the per-call view, drop the leaderboard. Pointing a manager at the exact line in a call works now. Ranking reps against each other does not, and will not until real managers have graded some calls.',
    summary:
      'Does a rubric score selling skill, or knowing how the call ended?',
    status: 'shipped',
    problem:
      'Agents close some calls and lose others for reasons nobody writes down. What if AI could find the pattern and turn it into coaching?',
    problemAttribution: 'Named in the role brief',
    hypothesis:
      'An AI can obviously put a score on a call. The thing worth testing is whether the score reflects how the rep sold, or just reflects knowing the call closed. A scorer that is secretly doing the second looks exactly like one doing the first.',
    killCriterion:
      'Score every call twice, once without telling the AI how it ended and once telling it, changing nothing else. If the scores move, the AI is grading the result instead of the selling, and the manager dashboard dies. Written down before building.',
    built: [
      'Sixty invented sales calls, assembled line by line from a bank of scripted lines, so the skill level each call depicts is known exactly rather than guessed at',
      'The exact line that demonstrates each skill recorded as the call is assembled, so "did it quote the right line" becomes answerable',
      'A scoring format in which a score without a supporting quote cannot exist',
      'Every quote checked against the transcript, and any score whose quote is not really there is withdrawn',
      'The whole thing scored twice: once blind to the outcome, once told the outcome',
      'One skill deliberately given zero effect on whether the call closes, as a trap for the scoring to fall into',
      'Six deliberately broken cases, to prove the quote checker can fail',
    ],
    metrics: [
      {
        name: 'Does knowing the result change the score?',
        value: 'Barely',
        detail: 'scores move 0.24 of a level out of 5. Anything over 0.5 would have killed it',
        source: 'eval_run',
      },
      {
        name: 'Leaderboard positions that moved when I reran it',
        value: '2 of 5',
        detail: 'nothing changed but punctuation in the transcripts. The top three held; the bottom two swapped',
        source: 'eval_run',
      },
      {
        name: 'Quotes that point at the right line',
        value: '95 to 98%',
        detail: 'on four of the five skills. The fifth is 78%',
        source: 'eval_run',
      },
      {
        name: 'Scores that exactly match the answer key',
        value: '1 in 2',
        detail: '52.7% exact, 88.6% within one level. Too rough to show a rep. This holds the bet back',
        source: 'eval_run',
        weakest: true,
      },
      {
        name: 'Replies that came back malformed',
        value: '7 to 10%',
        detail: 'across two runs. Without an automatic retry the first run died a quarter of the way in',
        source: 'instrumented',
      },
    ],
    cost: {
      hours: '~11',
      api: '$6.86',
      note: 'Two full runs at $3.33 and $3.53. The second was not planned. It is the one that produced the finding.',
    },
    roi: [
      {
        lever: 'Coaching time spent coaching, instead of hunting for the moment worth coaching.',
        formula: 'managers × hours a week spent listening × share of that spent searching × loaded hourly cost × 52',
        inputs: [
          { name: 'Managers who review calls', value: 'Your number', basis: 'guess' },
          { name: 'Hours a week each spends listening', value: 'Your number', basis: 'guess' },
          {
            name: 'Share of that spent finding the moment',
            value: 'Your number',
            basis: 'guess',
            note: 'The only part the tool touches. Coaching time itself is not saved and should not be counted.',
          },
        ],
        caveat:
          'Worth nothing if managers are not listening to calls today. Then the tool creates work, and the case becomes a revenue argument that needs a controlled trial.',
      },
      {
        lever: 'A lift in close rate from coaching the three habits the tool can reliably spot.',
        formula: 'agents × quoted cases a month × close rate × lift × commission × 12',
        inputs: [
          { name: 'Producing agents', value: 'Your number', basis: 'guess' },
          { name: 'Current close rate', value: 'Your number', basis: 'guess' },
          {
            name: 'Lift from coaching',
            value: 'Unknown',
            basis: 'guess',
            note: 'The number this rests on, and the one nothing here measures. Spotting a habit does not prove that coaching it changes behaviour.',
          },
        ],
        caveat:
          'Soft, and I would not put a figure on it. The test shows the tool can spot three real habits. It says nothing about whether telling a rep about them moves their close rate.',
      },
    ],
    verdict: 'de_scope',
    verdictRationale:
      'The test I set passed. Telling the AI how a call ended barely moved its scores, so it is grading the selling and not the result. A second check decided the bet. I gave one skill zero effect on whether calls close, then ran the same test twice on transcripts that differed only in punctuation. The top three habits held firm both times. The bottom two swapped places, and one of them was the skill I had rigged to matter not at all. A manager reading the leaderboard would have taken those two runs as two different findings. So the leaderboard is dead, the summary view only reports habits that survive a statistical test, and per-rep scores wait until real sales managers have graded some calls. The per-call view survives, because pointing at the line is something it does well.',
    wouldChangeIt:
      'Thirty calls graded independently by two of your sales managers. Everything here is agreement with an answer key I wrote, and this is the cheapest thing on the list to fix. Then the same test on about 200 calls, where the fourth habit becomes detectable. A better AI would change nothing; the problem was in how the results were reported.',
    links: [
      {
        label: 'Try it',
        href: 'https://scottdelia.github.io/coaching-copilot/',
        primary: true,
      },
      { label: 'Code', href: 'https://github.com/scottdelia/coaching-copilot' },
      {
        label: 'Full write-up',
        href: 'https://github.com/scottdelia/coaching-copilot/blob/main/docs/FINDINGS.md',
      },
    ],
  },
];
