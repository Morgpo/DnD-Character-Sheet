# DnD Character Sheet — Running the Dev Cycle

**This file is for the person running the process.** The agent's copy is
[`../.claude/skills/dnd-dev-cycle/SKILL.md`](../.claude/skills/dnd-dev-cycle/SKILL.md) —
where the two disagree, that file is what the agent actually does, and the disagreement
is a bug in this one.

This is a scaled-down version of the same idea used on bigger projects: an agent
investigates, a human approves, the agent does the work, a human merges. There's no
backend here and no production host, so there's no schema-migration skill, no deploy
script, and no multi-job CI — just a static app, its saved-data shape, and a test suite.

## The shape of it

```
issue filed (by you, or by an agent)
  -> you ask an agent to work it  ->  it investigates
  -> [GATE 1]  you accept the findings — or approve a plan, if it needs one
  ->  branch -> implement -> verify -> review -> PR     (unattended)
  ->  CI runs (reports, but doesn't block a merge yet — see below)
  -> [GATE 2]  you review, and you merge  ->  the issue closes
```

| | Phase | Who |
|---|---|---|
| 1 | Read the issue | agent |
| 2 | Investigate | agent |
| 3 | **Accept the findings, or approve the plan** | **you** |
| 4 | Branch | agent |
| 5 | Implement | agent |
| 6 | Verify (`npm test`, `npm run build`, conventions) | agent |
| 7 | Review against the checklist | agent |
| 8 | Open the PR | agent |
| 9 | Review the PR | you, by hand — see [gate 2](#gate-2--the-merge) |
| 10 | **Merge** | **you** |

Two decisions stay yours. Gate 1 exists because investigation routinely changes the
issue, and a branch cut from the issue's original framing is a sunk cost that argues for
building the wrong thing. Gate 2 exists because merge is the only step here nobody can
undo cheaply.

## Starting a cycle

**File the issue first.** The forms in [`../.github/ISSUE_TEMPLATE/`](../.github/ISSUE_TEMPLATE/):

| Form | Label | Use it when |
|---|---|---|
| Bug | `bug` | It behaves differently from how it should |
| Enhancement | `enhancement` | New behaviour, or a change to how something works |
| Half-built feature | `half-built` | It reads as finished from the outside, and isn't |
| *(blank issue)* | `needs investigation` | Nothing above fits, and scope isn't known yet |

Every form asks for the **module** — `attributes`, `actions`, `equipment`, `spells`,
`notes`, or `infra` — matching the page groupings in [`../CLAUDE.md`](../CLAUDE.md#page-routing).
Worth getting right; a wrong guess is most of a wasted investigation.

`good first issue` and `needs decision` are hand-applied, not form labels — the former
for a one-page, no-migration, nothing-open fix; the latter for a complaint with more
than one reasonable answer, where gate 1 comes back as 2-4 named options instead of one
proposed fix.

**Then ask an agent to work it.** Say *"work issue 12"* or paste the issue URL and
`dnd-dev-cycle` loads on its own.

### A well-formed issue

- **State the behaviour, not the fix.** "Initiative doesn't update when I change DEX"
  gives investigation somewhere to start; "add a useEffect to recalculate initiative"
  pre-commits to a diagnosis you haven't made — and this repo already has a documented
  case where that diagnosis would be wrong (see `docs/PROJECT_DOCUMENTATION.md`'s
  Known Quirks section: Initiative is manual by design-of-neglect, not by a missing
  `useEffect`).
- **One issue is one change.** If it needs two branches, it's two issues.
- **Say if you already know where it lives.** A file path is worth several minutes of
  searching in a 16-component tree.

## Gate 1 — after the investigation

The agent reports and stops, before creating a branch or editing a file. Three fields
and a route:

| Field | What a good one looks like |
|---|---|
| **The change** | What's wrong now, what it would change, which files — named, with line numbers. |
| **Risk** | `low`, `medium`, or `high`, with one clause of why. |
| **Open questions** | What it would otherwise decide by guessing. "None" is legitimate on a narrow fix. |
| **Route** | Simple fix, needs a plan, or options. |

### The risk ladder

This app's closest thing to a database migration is a change to the shape of the
character's saved data. `mergeWithDefaults()` in `src/App.jsx` only fills in *missing*
fields when loading an old save or backup file — it does not repair a field that got
renamed or restructured. That's the one genuinely expensive mistake available here,
since it can silently drop part of someone's actual saved character.

| | What puts it there |
|---|---|
| **high** | Renames, removes, or restructures a field in `getDefaultState()`. Touches `mergeWithDefaults`, `getInitialState`, `saveBackup`, or `loadBackup`. |
| **medium** | A prop contract used by more than one component (the `onChange(path, value)` convention, `attributes`/`proficiency`/`spellCasting` threaded into several components). A shared CSS class or token. |
| **low** | One component, one page, reversible. |

Say **go** explicitly when you're satisfied. Answering a question isn't a go-ahead.

### Signals it's misread the issue

- **A `getDefaultState()` shape change and Risk doesn't say `high`.** The one error here
  that's expensive to discover later — in someone's already-saved character.
- **Scope creep, phrased as tidiness.** "While I'm in there" is the tell. Anything
  noticed in passing becomes a new issue, not a second thing in the diff.
- **`high` risk and no open questions.** On a change to the saved-data shape, that
  usually means an ambiguity got resolved silently.

## What runs unattended

Phases 4 through 8, no input from you:

| Phase | Healthy | Not healthy |
|---|---|---|
| **Branch** | `<type>/<n>-<slug>` — `fix/12-initiative-not-calculated` — or an unrenamed harness `claude/…` branch. | A hand-typed name outside `<type>/<slug>`: fails `scripts/ci/check-conventions.sh`. |
| **Implement** | New state goes into `getDefaultState()` first; new UI follows the nearest analogous component; a calculation or dynamic-list change gets a test alongside it. | A new field wired into a component with no default added to `getDefaultState()` — it survives until the next `mergeWithDefaults()` load, then reads as `undefined`. |
| **Verify** | `npm test`, `npm run build`, `scripts/ci/check-conventions.sh` — all three finish in a few seconds, nothing else needs to be running. | Nothing heavier is needed here; there's no stack to start. |
| **Review** | Checks the diff against `docs/PROJECT_DOCUMENTATION.md`'s Known Quirks section and the page-routing table before opening the PR. | Opening a PR that leaves a doc contradicting the new behaviour. |
| **PR** | [`../.github/pull_request_template.md`](../.github/pull_request_template.md) filled in — Impact, Why, Validation, Risk — with `Closes #<n>` under Impact. | Sections deleted rather than answered, especially Risk. Missing `Closes #<n>`. |

## Reading CI

One job, `Verify`, in [`../.github/workflows/ci.yml`](../.github/workflows/ci.yml): branch/commit
conventions, `npm ci`, `npm run build`, `npm test`. It runs on every PR and reports —
**but it is not yet a required check.** `main` currently takes pushes and merges
directly; nothing blocks on a red run.

The policy for turning that on is committed at
[`../.github/rulesets/protect-main.json`](../.github/rulesets/protect-main.json), but
not applied. When you're ready to make a red `Verify` run actually block a merge:

```sh
bash scripts/ci/apply-ruleset.sh
```

That needs a `gh` token with admin rights on the repo, and only you should run it — see
the comments in the script. Until then, treat a red run as something to fix because it's
telling you something true, not because GitHub is stopping you.

## Gate 2 — the merge

There's no automated review loop — the PR gate plus you looking at it is enough for a
project this size. The agent stops at the PR URL and waits. What no CI check catches for
you:

- **`Closes #<n>` is present under Impact.** Without it the merge leaves the issue open.
- **The Risk section was answered, not deleted.** If it says "Nothing unusual" on a diff
  touching `getDefaultState()`, that's the finding.
- **The diff is the issue, and nothing else.**
- **A `getDefaultState()` change actually loads an old save/backup correctly** — the one
  thing `Verify` can't check for you, since there's no fixture backup file the test
  suite loads today. Try it by hand with a real backup JSON (there's a sample under
  `.backups/`) if the change touches state shape.

Then merge.

## What this flow does not do

- **It does not deploy anywhere.** There is no hosting configured for this app yet.
  Merging to `main` doesn't publish anything; if you add hosting later (GitHub Pages,
  Netlify, etc.), add a line here about what ships and when.
- **It does not close issues on its own.** The `Closes #<n>` link does, on merge. An
  agent does not close one by hand.
- **It does not test what nobody wrote a test for.** `npm test` is exactly as good as
  `src/*.test.jsx` and `src/components/*.test.jsx`. A green run means the guarantees
  that exist still hold, not that the change is correct.
- **It does not enforce anything on GitHub yet.** See "Reading CI" above — that's a
  deliberate, reversible choice, not an oversight.
