# Innovation Office, applied AI portfolio

> Every demo linked from this site runs on **synthetic data**. The carriers, the
> guidelines, the agents, and the transcripts are fabricated for demonstration
> and are labelled as such wherever they appear. Nothing here is affiliated with
> any insurance carrier, and nothing here is an offer, a quote, or underwriting
> advice.

Three time-boxed AI bets for insurance distribution. Each one carries either a
measured result or a kill criterion registered before the work started.

The operating idea the three share:

> **Synthetic ground truth is how you evaluate AI on a messy problem before you
> have clean data.**

The honest constraint on this kind of work is rarely the model. It is that
nobody can tell you whether the output is right, and the ground truth to check
it against does not exist yet. Generating the corpus from a known structured
source makes accuracy something measured rather than spot-checked, and a scorer
that cannot fail gets caught by a negative control.

---

## The bets

| # | Bet | Status | Verdict |
|---|---|---|---|
| 1 | [Underwriting Copilot](https://github.com/scottdelia/underwriting-copilot) | Shipped, measured | **Iterate** |
| 2 | Agent Onboarding Copilot | Scoped, not built | Pending |
| 3 | Call Coaching | Scoped, not built | Pending |

Bet 1 has a [live demo](https://scottdelia.github.io/underwriting-copilot/), a
[repository](https://github.com/scottdelia/underwriting-copilot), and a
[findings write-up](https://github.com/scottdelia/underwriting-copilot/blob/main/docs/FINDINGS.md)
that leads with what broke.

Bets 2 and 3 have no verdict because they have no evidence. Each carries the
result that ends it, written down in advance. A criterion set afterwards is an
opinion, and set beforehand it is a decision.

---

## Three rules this site follows

**Every number says where it came from.** An eval result, an instrumented
measurement, and an estimate are three different kinds of claim. The type system
enforces the tagging: `MeasuredMetric` cannot be constructed without a `source`
and `RoiInput` cannot be constructed without a `basis`, so a guess cannot end up
on the page dressed as a measurement.

**The ROI models have no total.** The inputs that would decide one, how many
producing agents, what share of declines trace to a misjudged class, belong to
the business and are not mine to invent. The site shows the lever, the
arithmetic, and every input tagged `measured`, `industry assumption`, or `needs a
real number`. `guess` is a permitted value; a model with no guesses in it is
either trivial or lying about itself.

**Kill is not styled as a failure.** The brief this portfolio answers measures
success partly as *"ideas that were correctly killed before consuming real
resources."* A kill is a successful outcome of the process, so it gets the
neutral treatment rather than a red one. Nothing on this site is coloured as an
error, because nothing on it went wrong.

---

## Running it

Requires Node 20.19+ or 22.12+.

```bash
npm install && npm run dev
```

```bash
npm run build && npm run preview
```

Pushing to `main` builds and publishes to GitHub Pages via
`.github/workflows/pages.yml`. The live page is built from the committed source
on every push, so it cannot drift from the repository.

---

## Conventions

- **React and Tailwind v4, and no UI, icon, or chart library.** The only other
  runtime dependency is `@fontsource-variable/inter`. A typeface, self-hosted so
  the page makes no third-party request on load. Icons are inline SVG.
- **The design tokens in `src/index.css` are lifted verbatim from the
  Underwriting Copilot.** That is the reason they were written as tokens. The two
  sites should read as one body of work with two front doors, not as two
  projects that happen to share an author. Components never name a colour; the
  dark theme is the same token block with different values, which is why there
  is not one `dark:` class anywhere.
- **The router is thirty lines of hash routing** over `useSyncExternalStore`.
  Hash rather than the History API because Pages serves static files and cannot
  rewrite a deep link back to `index.html`, under the History API a refresh on
  `/bet/underwriting` would 404.
- **Content is data, not prose in a component** (`src/content/bets.ts`). A card
  and a one-pager render the same facts at different depths, and a fact written
  twice is a fact that will eventually disagree with itself.
