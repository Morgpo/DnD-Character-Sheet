# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # Install dependencies
npm run dev       # Start dev server (Vite, http://localhost:3000, auto-opens browser)
npm run build     # Production build
npm run preview   # Preview the production build
npm test          # Run the Vitest suite once (src/**/*.test.jsx)
npm run test:watch # Vitest in watch mode
```

There is no linter configured. Tests use Vitest + React Testing Library, set up in [vite.config.js](vite.config.js) (a `test` block, not a separate config file) with matchers loaded from [src/test/setup.js](src/test/setup.js). Coverage is intentionally thin — a handful of smoke tests for page routing, save-data resilience, and the calculation-heavy components (see [src/App.test.jsx](src/App.test.jsx), [src/components/Attributes.test.jsx](src/components/Attributes.test.jsx), [src/components/Attacks.test.jsx](src/components/Attacks.test.jsx)) — not exhaustive coverage of every component.

## Working an issue

There's an issue-driven dev cycle for non-trivial changes: file (or read) a GitHub issue
using the forms in [.github/ISSUE_TEMPLATE/](.github/ISSUE_TEMPLATE/), then say "work
issue N" to load the [dnd-dev-cycle](.claude/skills/dnd-dev-cycle/SKILL.md) skill, which
investigates and stops for approval before branching, then implements/verifies/reviews
and opens a PR for the user to merge. [docs/workflow.md](docs/workflow.md) is the
human-facing half of that same process. For a small, obviously-scoped fix, skip the
ceremony and just make the change.

## Architecture

Single-page React 18 + Vite app, no router, no backend — everything is client-side and persisted to `localStorage`. There is one source of truth for state, held in [App.jsx](src/App.jsx), and passed down to presentational components as props.

### State shape and update flow

- `getDefaultState()` in [App.jsx](src/App.jsx) defines the entire `character` object schema (basicInfo, topBar, attributes, status, saves, skills, spellCasting, proficiencies, features, charges, attacks, actions, equipment, spells, backstory, notes). **Any new field must be added here first** or it won't survive the merge-with-defaults step below.
- All edits flow through one function: `updateCharacter(path, value)` (a `useCallback` in App.jsx), called by children as `onChange('some.nested.path', value)`. It splits the dot-path, rebuilds each level immutably, and sets state. This is why components never get field-specific setters — they all just call the same `onChange` with a path string.
- Dynamic list sections (attacks, actions, charges, equipment items, spells) don't use dot-paths for individual items; the child component mutates its own copy of the array and calls `onChange('attacks', newArray)` to replace the whole array at once. Each list item needs a unique `id` (typically `Date.now()`) for React keys and for move-up/move-down/delete logic.
- Auto-save: a `useEffect` on `character` debounces 1000ms then writes JSON to `localStorage['dnd_character_sheet_autosave']`.
- Load path: `getInitialState()` reads that localStorage key and runs it through `mergeWithDefaults(defaults, uploaded)` — a recursive merge that fills in any field missing from saved/uploaded data using `getDefaultState()`. This is also reused for the JSON backup import (`loadBackup`) and is what makes old save files forward-compatible when new fields are added. Corrupted localStorage JSON is caught and wiped rather than crashing the app.
- Backup export (`saveBackup`) just downloads the current `character` state as a JSON file named after the character; backup import (`loadBackup`) reads a user-selected file, runs it through the same merge, and immediately overwrites both state and localStorage.

### Page routing

`currentPage` in App.jsx is a plain string switched with `{currentPage === '...' && ...}` blocks — there is no router. The real page keys, set from [Sidebar.jsx](src/components/Sidebar.jsx), are:

| `currentPage` value | Sidebar label | Components rendered |
|---|---|---|
| `attributes` | Attributes | Attributes, SavesAndSkills, Proficiencies, FeaturesTraits |
| `overview` | Actions | Status, Attacks, Actions, Charges |
| `equipment` | Inventory | Equipment |
| `spells` | Spell Sheet | Spells |
| `notes` | Notes | Notes, Backstory |

The `currentPage` value and its sidebar label deliberately don't match (`overview` ⇒ "Actions"), and there is no `backstory` page — Backstory renders under `notes`. `CharacterBasicInfo` is rendered outside the page switch, so it's visible on every page. When adding a new page, update both the switch block in App.jsx and the nav link in Sidebar.jsx.

### Component conventions

- **Field components** (`Proficiencies`, `FeaturesTraits`, `Notes`, `Backstory`, `Status`): receive a `data` slice of `character` plus `onChange`, no local state, just controlled inputs.
- **Calculated components**: `Attributes` derives ability modifiers with `useMemo`; `CharacterBasicInfo` derives proficiency bonus and passive perception inline (both read-only in the UI); `SavesAndSkills` derives save/skill bonuses and also writes a computed spell DC into `topBar.spellDC`; `Attacks`/`Actions` derive to-hit/save DC per row. Don't add a state field for something that can be computed on render — but see the caveats below before assuming a given header stat is one of these.
- **Dynamic list components** (`Charges`, `Attacks`, `Actions`, `Equipment`, `Spells`): each implements its own add/update/delete/move-up/move-down against a local copy of the array, then calls `onChange(arrayPath, newArray)`. Follow an existing one (Attacks.jsx or Charges.jsx are the clearest) as a template for a new list feature rather than designing a new pattern.
- `Spells.jsx` is the largest/most special-cased component: it has separate handling for cantrips (no slots, no "prepared" flag) vs. leveled spells 1–9 (each with a slot-count that resizes a boolean array of used/unused slots).

### Caveats: not everything is wired up the way it looks

This is an old, several-times-refactored repo — a few things look auto-calculated or connected but aren't. Verify before relying on any of these:

- `basicInfo.level`, `basicInfo.levelTwo`, `basicInfo.playerName`, `basicInfo.alignment`, `basicInfo.deity` exist in `getDefaultState()` but have **no UI anywhere**. If asked to add a player-name/alignment field, the state slot is already there — just add the input.
- `topBar.initiative` is a **manual** editable field in CharacterBasicInfo.jsx, not auto-calculated from DEX — a DEX-modifier calculation sits right above it in the same file but its result is never used.
- `topBar.spellDC` is written by SavesAndSkills.jsx but **never read/displayed anywhere**. The Spell DC actually shown to the user (on the Spells page) is a separate, independent calculation inside Spells.jsx from the same underlying inputs — the two happen to agree in value today, but they are not the same code path.
- `mergeWithDefaults` (used for both localStorage load and backup import) takes arrays from the uploaded/saved data as-is rather than merging item-by-item — a missing array falls back to the default, but a malformed item inside a present array is not repaired.

[docs/PROJECT_DOCUMENTATION.md#known-quirks--dead-code](docs/PROJECT_DOCUMENTATION.md#known-quirks--dead-code) tracks these in more detail — check it (and update it) if you find more drift between the docs and the source.

### Styling

Dark medieval-fantasy theme driven entirely by CSS custom properties defined in [src/index.css](src/index.css) (`--bg-primary`, `--bg-secondary`, `--bg-light`, `--text-light`, `--text-dark`, `--accent`, `--border`, `--success`, `--danger`, `--neutral`, `--shadow`). Full rules are in [docs/BRANDING.md](docs/BRANDING.md); the essentials:
- Never hardcode a hex color or add a new CSS variable for a slight variation — reuse the existing token and use `filter: brightness(...)` for hover/lighten/darken effects, or `opacity` for muted text.
- Headings use `Cinzel`, body/inputs use `EB Garamond` (both loaded via Google Fonts in [index.html](index.html)).
- Most layout/component CSS lives in one file, [src/App.css](src/App.css) (~1300 lines); only `ConfirmModal` has its own CSS file. New components generally add rules to App.css rather than creating a new stylesheet, following existing conventions there (`.card`, `.section-title`, `.info-group`, `.auto-filled`, `.two-column-layout`, `.action-buttons`).

### Reference docs

[docs/PROJECT_DOCUMENTATION.md](docs/PROJECT_DOCUMENTATION.md) has a detailed per-component breakdown, kept in sync with the source as of this writing — but this project has drifted from its docs before (that's why the caveats section above exists), so if something there ever looks inconsistent with `App.jsx`/`Sidebar.jsx`, trust the source and fix the doc. [docs/BRANDING.md](docs/BRANDING.md) is authoritative for color/typography rules. [docs/workflow.md](docs/workflow.md) covers the dev cycle itself (gates, risk ladder, CI).
