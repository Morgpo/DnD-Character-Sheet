# What each report has to contain

Three reports, all short — a gate should be a decision the user can make from one
message, without opening the repo to reconstruct what you found.

## Gate 1 — findings, before any branch exists

```
#<n> <title>   [labels]

The change        Two or three sentences. What's wrong now, what you'd change, and
                  which files — name them, since `src/components/Attacks.jsx:58` is
                  checkable and "somewhere in the attacks code" is not. If your reading
                  of the issue differs from its wording, that difference goes here
                  first — it's usually the most useful line in the report.
Risk              low | medium | high, one clause why. Ladder in SKILL.md.
Open questions    Only what you'd otherwise decide by guessing. "None" is fine and is
                  not a warning on a narrow fix.
Route             Simple fix, needs a plan, or options.
```

Then: **stop.** No branch, no edits. Ask questions and wait for an explicit go-ahead.

### Which route

**Simple fix** — one component/page, no state-shape change, nothing open. The three
fields are the whole gate: the user confirms the approach, you go.

**Needs a plan** — high risk, more than one page, a `getDefaultState()` shape change, or
an open question that changes what gets built. Say so in the Route line, then draft the
plan in plan mode. The plan's approval **is** gate 1 for this class — don't also write a
long report.

**Options** — the issue carries `needs decision`, or investigation turns up a real
tradeoff the issue doesn't resolve. Replace "The change" with 2-4 named options:

```
#<n> <title>   [needs decision]

Problem           What's actually wrong, in the issue's own terms — not yet a fix.
Option A          One or two sentences: what changes, which files, what it costs.
Option B          Same shape. A third and fourth only if genuinely distinct.
Risk              Per option if it differs, otherwise once.
Route             Options
```

No recommendation ranked to the top — that's the user's call, and naming a favorite
nudges it.

## Stop-and-report — investigation contradicted the issue

```
#<n> <title>   -> STOPPING: <already fixed | wrong | larger than stated | blocked>

Evidence       The commit, file, or line that shows it.
What is true   What the code actually does, if that differs from the issue.
Proposal       Close it / reword it / split it into these sub-issues / it's blocked
               on #<m>.
```

- **Already fixed** — name the commit that covers it. Offer to close; don't close it
  yourself.
- **Wrong** — report the real behaviour. That's a new issue's worth of information, not
  a licence to fix something adjacent.
- **Larger than stated** — propose a split as concrete sub-issues. Don't start the first
  one.
- **Blocked** — name the open issue it depends on.

## Gate 2 — handing off the PR

```
PR <url>  ->  #<n>

Changed        The files, one line each.
Ran            Commands and results — "npm test -> 9 passed", "npm run build -> OK",
               "check-conventions.sh -> OK".
Risk           getDefaultState() shape change? A prop contract or CSS token shared
               across pages? Say what the rollback is. Copy this into the PR's Risk
               section too.
Watch for      Anything you'd want a reviewer to look at hardest.
```

Then stop. Report CI status if asked, push fixes if it's red — the merge belongs to the
user.
