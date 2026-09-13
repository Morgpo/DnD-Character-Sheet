# D&D 5e Character Sheet

A web-based character sheet for Dungeons & Dragons 5th Edition. Built with React and Vite, it runs entirely in the browser: character data autosaves to `localStorage`, and can be exported to / imported from a JSON backup file.

Originally forked from [Chee32/5e-Character-Sheet](https://github.com/Chee32/5e-Character-Sheet) by [@Chee32](https://github.com/Chee32) and [@lckynmbrsvn](https://github.com/lckynmbrsvn), then rebuilt in React by [@Morgpo](https://github.com/Morgpo).

## Features

- Ability scores with auto-calculated modifiers, proficiency bonus, and passive perception
- Saving throws and skills with proficiency/expertise tracking
- HP, hit dice, and death saves
- Attacks and actions with auto-calculated to-hit bonus / save DC
- Reusable resources and item charges (Ki points, Rage, etc.) tracked with checkboxes
- Spellcasting: spell slots by level, cantrips and leveled spells, prepared-spell tracking, optional wiki links per spell
- Currency and inventory with running weight total
- Backstory, personality, and free-form notes
- Autosave to the browser every second, plus manual JSON backup export/import and a "Clear Sheet" reset

## Running it locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`.

```bash
npm run build     # production build, output in dist/
npm run preview   # preview the production build
npm test          # run the test suite
```

## Saving & loading

- **Autosave** — changes save to browser `localStorage` a second after you stop typing. Data stays in that browser only.
- **Save Backup** — downloads the current character as a JSON file.
- **Load Backup** — loads a character from a previously saved JSON file.
- **Clear Sheet** — resets to a blank character (with a confirmation prompt).

For anything you don't want to lose, download a backup — `localStorage` can be cleared by the browser or lost if you switch devices.

## Docs

- [docs/PROJECT_DOCUMENTATION.md](docs/PROJECT_DOCUMENTATION.md) — architecture and component-by-component breakdown
- [docs/BRANDING.md](docs/BRANDING.md) — color palette and styling conventions
- [docs/workflow.md](docs/workflow.md) — the issue-driven dev cycle for non-trivial changes (file an issue, an agent investigates and stops for approval, then implements and opens a PR for review)
