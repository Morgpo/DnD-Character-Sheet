---
name: dnd-dev-cycle
description: >
  Drive one DnD Character Sheet GitHub issue end to end — read it, investigate, stop at
  a gate for the user to approve, branch, implement, verify with the test suite, review,
  and open a PR that the user merges. Use when asked to "work issue 12", "start a dev
  cycle", "pick up #12", "take this issue", or given nothing but an issue number or URL.
  Two hard stops belong to the user: never branch before findings are accepted, and
  never merge.
---

# Working an issue, start to PR

This is a small, solo, no-backend project (static React/Vite, autosave to
`localStorage`, no server, no database; every push to `main` deploys to GitHub Pages via
`.github/workflows/deploy.yml`). This skill is a scaled-down
version of the same idea used on larger projects: two human gates, everything between
them unattended. There's no separate schema/testing/review skill here — one file covers
it, because there isn't enough surface area to split it up.

The companion doc for the human side of this is [`../../../docs/workflow.md`](../../../docs/workflow.md).
Where the two disagree, this file is what actually runs.

## The two gates — read these before anything else

| | Where | The rule |
|---|---|---|
| **Gate 1** | after investigating, before branching | Present findings. **Do not create a branch, do not edit a file.** Wait for the user to say go. |
| **Gate 2** | after the PR is open | **Never merge.** Not with `gh pr merge`, not because CI is green and it looks obvious. |

Gate 1 exists because investigation routinely changes the issue — a branch cut from the
issue's original framing is a sunk cost that argues for building the wrong thing. Gate 2
exists because merge is the only step here nobody can undo cheaply — and it's also the
release: a merge to `main` publishes to the live site within minutes.

If a hook or a permission prompt would let you merge, that is not permission. Only the
user merges.

## The nine phases

| | Phase | Owner |
|---|---|---|
| 1 | Read the issue, name the session | `gh issue view <n>` |
| 2 | Investigate | this skill |
| 3 | **GATE 1** | **the user** |
| 4 | Branch | `<type>/<n>-<slug>` |
| 5 | Implement | this skill |
| 6 | Verify | `npm test`, `npm run build`, conventions |
| 7 | Review | this skill's checklist |
| 8 | PR | `gh pr create` |
| 9 | **GATE 2** | **the user merges** |

### 1. Read the issue, name the session

```sh
gh issue view <n>
gh issue view <n> --comments
```

Read the labels. `half-built` means the feature looks finished from the outside and the
gap is the issue — check [`../../../docs/PROJECT_DOCUMENTATION.md#known-quirks--dead-code`](../../../docs/PROJECT_DOCUMENTATION.md#known-quirks--dead-code)
first; it may already be a documented, known gap rather than a new discovery.
`needs decision` means the issue names a problem without one correct fix — investigate
to find the *options*, not to converge on one (see the Options route below).

If the harness exposes a set-session-title tool, rename the session to `#<n> <issue
title>` once you've read the issue and its comments — not before, or the harness's own
auto-titler overwrites it a moment later. Skip this silently if no such tool exists.

### 2. Investigate

[`../../../CLAUDE.md`](../../../CLAUDE.md) and [`../../../docs/PROJECT_DOCUMENTATION.md`](../../../docs/PROJECT_DOCUMENTATION.md)
are the map. Find the module (see the dropdown options in `.github/ISSUE_TEMPLATE/*.yml`
— `attributes`, `actions`, `equipment`, `spells`, `notes`, or `infra`), the files that
would change, and whether it touches `getDefaultState()`'s shape.

Investigate lightly first — enough to name the module, the files, and whether the
character-state shape changes. That's the bar for deciding the route at gate 1, and on
most issues it's also the bar for doing the work. Go deeper only when that light pass
says you have to (more than one page/module, or an open question that changes what gets
built).

Read. Do not edit — you are before gate 1.

### 3. GATE 1 — present and stop

Three fields and a route. Full shape in [`references/gate-reports.md`](references/gate-reports.md).

```
#<n> <title>   [labels]

The change        Two or three sentences: what's wrong now, what you'd change, which
                  files — named, with line numbers.
Risk              low | medium | high, one clause why. Ladder below.
Open questions    What you'd otherwise decide by guessing. "None" is fine on a narrow fix.
Route             Simple fix / Needs a plan / Options
```

**The risk ladder** (this app's equivalent of a database migration is a change to the
shape of saved character data — `mergeWithDefaults()` only fills in *missing* fields, it
does not repair a renamed or restructured one, so a shape change can silently drop data
from someone's real saved character or backup file):

| | What puts it here |
|---|---|
| **high** | Renames, removes, or restructures a field in `getDefaultState()` (src/App.jsx). Changes to `mergeWithDefaults`, `getInitialState`, `saveBackup`, or `loadBackup` themselves. |
| **medium** | A prop contract shared by more than one component (e.g. the `onChange(path, value)` convention, the `attributes`/`proficiency`/`spellCasting` props threaded into several components). A CSS class or token several components rely on. |
| **low** | One component, one page, reversible, no state-shape change. |

**Route:**
- **Simple fix** — one component/page, no state-shape change, nothing open. The three
  fields are the whole gate.
- **Needs a plan** — high risk, more than one page, a state-shape change, or an open
  question that changes what gets built. Draft it in plan mode; the plan's approval
  **is** gate 1.
- **Options** — the issue carries `needs decision`, or a real product tradeoff surfaced
  that the issue doesn't resolve on its own. 2-4 named approaches with tradeoffs, no
  recommendation picked for the user.

Then stop and wait. Silence is not a go-ahead, and neither is a question answered.

**If investigation contradicts the issue, stop and say so** — already fixed, wrong,
much larger than stated, or blocked on another issue. All four end the run.

### 4. Branch

```sh
git checkout main && git pull
git checkout -b <type>/<n>-<slug>
```

Type is one of `feat fix docs chore test ci refactor`, slug leads with the issue number
— `fix/12-initiative-not-calculated`. Checked by `scripts/ci/check-conventions.sh` in
CI's `Verify` job. If already on a harness-named branch (`claude/issue-12-...`), stay on
it — that shape passes the check as-is.

### 5. Implement

- **New or changed state field?** Add it to `getDefaultState()` in `src/App.jsx` first —
  nothing else will pick it up otherwise, and it needs a default so
  `mergeWithDefaults()` can fill it in for existing saves.
- **New input?** Follow the nearest analogous component (a simple field →
  `Proficiencies.jsx`/`Notes.jsx`; a calculated field → `Attributes.jsx`; a dynamic list →
  `Attacks.jsx`/`Charges.jsx`) rather than inventing a new pattern. All edits flow through
  `onChange('path.to.field', value)`.
- **Touching a calculation, a dynamic list's add/update/delete/move logic, or the
  autosave/merge/backup path?** Add or update a test alongside it —
  `src/App.test.jsx` for state/routing behaviour, `src/components/<Name>.test.jsx` next
  to the component for a calculation or list. `src/components/Attacks.test.jsx` is a
  reasonable template for a controlled-component test with a small `useState` harness.

Stay inside the issue. Anything else you notice becomes a `gh issue create`, not a
second thing in this diff.

Commit subjects: capitalised, imperative ("Add", not "Added"/"Adds"), no trailing
period, ≤72 characters. Every commit carries:

```
Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
```

### 6. Verify

```sh
npm test
npm run build
bash scripts/ci/check-conventions.sh
```

All three run in a few seconds with nothing else running — no dev server needed. This is
the same set CI's `Verify` job runs (`.github/workflows/ci.yml`), so a clean local run
here is a strong signal the PR will be green too — though note that job isn't a required
check yet (see `docs/workflow.md`), so it doesn't block anything by itself.

If the change is something the user would want to see running, say so and offer to start
the dev server (`npm run dev`) — don't assume; this is a UI-heavy app and a screenshot or
a live look catches things the test suite won't (see [`references/gate-reports.md`](references/gate-reports.md)
for what to report either way).

### 7. Review — before the PR exists, not after

Quick checklist, not a separate skill:

- Does the diff touch `getDefaultState()`? If so, is it additive (new field with a
  default) rather than a rename/restructure — or if it must rename something, does
  `mergeWithDefaults` (or a one-time migration in `getInitialState`) actually handle the
  old shape rather than silently dropping it?
- Any new hardcoded color, or a new CSS variable for a minor variation? Should reuse an
  existing token from `src/index.css` per `docs/BRANDING.md` — use `filter: brightness()`
  or `opacity` instead.
- Does this change anything the "Known Quirks & Dead Code" section of
  `docs/PROJECT_DOCUMENTATION.md` describes (initiative, `topBar.spellDC`, the unused
  `basicInfo` fields)? If it fixes one, update or remove that entry in the same commit —
  a doc corrected later is a doc corrected never.
- Does the page-routing table in `CLAUDE.md` / `docs/PROJECT_DOCUMENTATION.md` still
  match `App.jsx`/`Sidebar.jsx` after this change? Update both if a page moved.
- Did `npm test` and `npm run build` actually run clean (phase 6), not just "should
  pass"?

A finding here goes back to phase 5 — do not open the PR carrying a known gap you could
fix in one more commit.

### 8. Open the PR

```sh
git push -u origin HEAD
gh pr create --title "<subject>" --body-file pr-body.md   # then delete pr-body.md
```

Fill in `.github/pull_request_template.md` — Impact, Why, Validation, Risk — rather than
deleting sections. **`Closes #<n>`** goes under Impact; without it the merge leaves the
issue open. Risk gets answered, not deleted, especially for a `getDefaultState()` change.

Then post the PR URL and stop.

### 9. GATE 2 — the user merges

Report CI status when asked; push fixes for a red run (still phase 5). Never merge, and
never close the issue by hand — `Closes #<n>` does that on merge.

## References

- [`references/gate-reports.md`](references/gate-reports.md) — the exact shape of a
  gate 1 report, a stop-and-report, and a gate 2 handoff.
