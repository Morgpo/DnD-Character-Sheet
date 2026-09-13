## Impact

<!-- What changes for someone using the character sheet. Not a restatement of the diff. -->

Closes #

## Why

<!-- The problem this solves. If it fixes a bug, what the wrong behaviour was. -->

## Validation

<!-- "Tests pass" on its own isn't validation — say what you actually ran. -->

- [ ] `npm test` passes
- [ ] `npm run build` succeeds
- [ ] Tried it in the browser (not just read the diff) — check this right before merging, not when you open the PR

## Risk

<!--
Delete the ones that don't apply.

- Changes the shape of getDefaultState() in src/App.jsx — a field renamed, removed, or
  restructured. mergeWithDefaults() only fills in *missing* fields, so this can silently
  drop data from someone's saved character or backup file.
- Changes the autosave / backup / load code path itself (App.jsx).
- Changes a prop contract or CSS class shared across more than one page.
-->

Nothing unusual.

---

<!--
CI (.github/workflows/ci.yml) runs on every PR but does not yet block a merge — see
docs/workflow.md. Read the run anyway; a green build+test doesn't mean someone looked at
the change running.
-->
