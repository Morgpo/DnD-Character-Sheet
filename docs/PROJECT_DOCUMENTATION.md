# D&D Character Sheet Application - Technical Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [State Management](#state-management)
5. [Component Structure](#component-structure)
6. [Component Breakdown](#component-breakdown)
7. [Data Persistence](#data-persistence)
8. [File Organization](#file-organization)
9. [Adding Features](#adding-features)
10. [Styling System](#styling-system)
11. [Known Quirks & Dead Code](#known-quirks--dead-code)

---

## Project Overview

**Project Name:** D&D 5th Edition Character Sheet
**Version:** 2.0 (React version)
**Purpose:** A web-based character sheet for Dungeons & Dragons 5th Edition that allows players to create, manage, and save character data locally in their browser.

### Key Features
- **Auto-Save:** Character data automatically saves to browser local storage every 1 second after user input
- **Import/Export:** Save character data as JSON files and load them back
- **Dynamic Calculations:** Auto-calculates modifiers, proficiency bonus, passive perception, spell DC, and attack/save bonuses
- **Page-Based Navigation:** Multiple sections organized as logical "pages" (see [Architecture](#architecture) for the actual page map)
- **Dynamic Lists:** Add/remove/reorder attacks, spells, equipment, charges, and actions
- **D&D 5e Compliance:** Follows official D&D 5e mechanics for skill checks, attribute modifiers, spell slots, etc.

---

## Tech Stack

### Core Dependencies
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1"
}
```

### Build & Development Tools
- **Build Tool:** Vite 6 - Fast, modern module bundler for React
- **React Plugin:** @vitejs/plugin-react - Enables JSX and Fast Refresh
- **Type Support:** @types/react and @types/react-dom (types only; the project itself is plain JS/JSX, not TypeScript)
- **Testing:** Vitest + React Testing Library, configured via a `test` block in `vite.config.js` rather than a separate config file. Coverage is a handful of smoke tests, not exhaustive.

There is no linter configured.

### How to Run
```bash
npm install          # Install dependencies
npm run dev         # Start dev server (http://localhost:3000, per vite.config.js)
npm run build       # Build for production
npm run preview     # Preview built app
npm test            # Run the test suite once
npm run test:watch  # Run it in watch mode
```

---

## Architecture

### High-Level Flow

```
App.jsx (Main Container)
    ├── State Management (character, currentPage, sidebarOpen, showClearConfirm)
    ├── Local Storage Management (autosave, load, merge with defaults)
    ├── Backup/Restore Functions (saveBackup, loadBackup, clearSheet)
    │
    ├── Sidebar Component (Navigation)
    │   └── Page selection & Options (Clear, Save, Load)
    │
    ├── Main Content Area
    │   └── CharacterBasicInfo (Always visible, regardless of currentPage)
    │   └── Page-Based Components (currentPage value → sidebar label)
    │       ├── 'attributes' → "Attributes"
    │       │   ├── Attributes (race/background/class + ability scores)
    │       │   ├── SavesAndSkills
    │       │   ├── Proficiencies
    │       │   └── FeaturesTraits
    │       ├── 'overview' → "Actions"
    │       │   ├── Status
    │       │   ├── Attacks
    │       │   ├── Actions
    │       │   └── Charges
    │       ├── 'equipment' → "Inventory"
    │       │   └── Equipment
    │       ├── 'spells' → "Spell Sheet"
    │       │   └── Spells
    │       └── 'notes' → "Notes"
    │           ├── Notes
    │           └── Backstory
    │
    └── Footer & Utility Buttons (scroll-to-top, mobile menu toggle)
```

**Important:** the `currentPage` string values (`attributes`, `overview`, `equipment`, `spells`, `notes`) do not match their sidebar labels 1:1 — most notably `overview` is labeled "Actions" in the sidebar, and there is no page called `backstory` (Backstory is rendered together with Notes on the `notes` page). Always check [App.jsx](../src/App.jsx)'s page-switch block and [Sidebar.jsx](../src/components/Sidebar.jsx) directly before assuming a page name from this doc or from either file alone.

### Data Flow Pattern
1. **User Input** → Input field in component
2. **Change Handler** → `onChange('path.to.field', value)` callback
3. **Update Character** → `updateCharacter()` function (nested object path update)
4. **State Update** → `setCharacter()` with immutable state pattern
5. **UI Re-render** → Component re-renders with new value
6. **Auto-save** → Debounced save to localStorage after 1 second of inactivity

---

## State Management

### Global State Structure (`character` object)

The state is organized into logical sections matching the UI components. This list follows `getDefaultState()` in App.jsx (the authoritative source — check it directly when a field name matters):

- **basicInfo** - `charName`, `currentLevel`, `race`, `background`, `classes`, `size`, `exp`. Also defines `level`, `levelTwo`, `playerName`, `alignment`, `deity`, which exist in the default state but currently have **no UI anywhere** — see [Known Quirks](#known-quirks--dead-code).
- **topBar** - Quick stats: `proficiency`, `initiative`, `passivePerception`, `ac`, `speed`, `spellDC`, `inspiration`. Despite the names, not all of these are auto-calculated — see below.
- **attributes** - The six core ability scores (STR, DEX, CON, INT, WIS, CHA), free-text (no enforced 3-20 range in code)
- **status** - Health tracking (current/temp/max HP), hit dice, death saves, conditions, boons
- **saves** - Saving throw proficiency boolean for each ability (STR-CHA)
- **skills** - 18 skills, each with `prof` and `expert` boolean flags
- **spellCasting** - Which ability governs spell attacks/DC (ability name or `'none'`)
- **proficiencies** - `languages`, `armor` (light/medium/heavy/shields booleans), `weapons` (simple/martial booleans), `weaponMasteries`, `tools`
- **features** - `feats`, `racialTraits`, `classFeatures`, `backgroundFeatures` (free text)
- **charges** - Dynamic list of resources like Ki Points or Rage (id, name, max, current, notes)
- **attacks** - Dynamic list of weapon/spell attacks (id, name, stat, attackType, damage, damageType, notes, addProf, plus optional manualHit/manualDC when stat is 'custom')
- **actions** - Dynamic list of bonus actions/abilities (id, name, stat, saveDC-derived, description, plus optional manualDC when stat is 'custom')
- **equipment** - Currency (cp/sp/ep/gp/pp), `items` array (id, name, weight), `capacity`, `encumbrance`
- **spells** - `spellClass`, `slotCounts` (per level 1-9), `slots` (per level, boolean array of used/unused), `cantrips`, `level1`...`level9` (each spell: id, name, link, prepared)
- **backstory** - `personality`, `ideals`, `bonds`, `flaws`, `backstory`, `appearance`, `allies`
- **notes** - `notes1`, `notes2` (two free-form text areas)

### Which "auto-calculated" fields are actually calculated

A few fields look derived but aren't, and vice versa — this trips people up when extending the header/stat area:

| Field | Where computed | Auto-calculated? |
|---|---|---|
| `topBar.proficiency` | [CharacterBasicInfo.jsx](../src/components/CharacterBasicInfo.jsx) from `basicInfo.currentLevel`, pushed via `useEffect` | Yes — read-only in the UI |
| Passive Perception | [CharacterBasicInfo.jsx](../src/components/CharacterBasicInfo.jsx), computed inline from WIS mod + perception proficiency, not stored in state | Yes — read-only, derived on render |
| `topBar.initiative` | N/A | **No** — plain editable input in CharacterBasicInfo.jsx, despite a DEX-modifier calculation sitting unused right above it in the same file |
| `topBar.spellDC` | [SavesAndSkills.jsx](../src/components/SavesAndSkills.jsx), computed and written via `useMemo`/`onChange` | Written, but **never displayed anywhere** |
| Spell DC / Spell Attack shown on the Spells page | [Spells.jsx](../src/components/Spells.jsx), calculated independently from `spellCasting`/`attributes`/`proficiency` props | Yes — its own calculation, does not read `topBar.spellDC` |

### State Update Pattern

App.jsx uses a generic **path-based update function** that accepts a dot-notation string and a value. This allows components to update any nested property without needing specialized update functions for each field.

**How it works:**
- Components call `onChange('path.to.field', value)` with a dot-notation path
- The function splits the path and navigates through the nested object structure
- It creates new object references at each level to maintain immutability (required by React)
- This works for simple fields like `'basicInfo.charName'` or a specific array index like `'spells.slots.1'`

**Key Points:**
- All state updates are immutable (new object references created)
- For lists, components typically replace the entire array rather than updating individual items
- Auto-save debounces for 1 second to avoid excessive localStorage writes
- Default state includes all required fields to prevent undefined errors during merges

---

## Component Structure

### Component Categories

#### 1. **Container/Navigation Components**
- **App.jsx** - Main app container, state management, page routing
- **Sidebar.jsx** - Side navigation, page selection, options menu

#### 2. **Display Components (Single Section)**
- **CharacterBasicInfo.jsx** - Character name and the header stat row (level, XP, inspiration, AC, HP, speed, size, proficiency, initiative, passive perception)
- **Attributes.jsx** - Race/Background/Class info, plus the six ability scores with auto-calculated modifiers
- **Status.jsx** - HP, hit dice, death saves, conditions
- **Proficiencies.jsx** - Armor, weapons, weapon masteries, tools, languages
- **FeaturesTraits.jsx** - Feats, racial traits, class features, background features
- **Notes.jsx** - Two text areas for miscellaneous notes
- **Backstory.jsx** - Personality traits/ideals/bonds/flaws, backstory, appearance, allies

#### 3. **Dynamic List Components**
- **Charges.jsx** - Resources and charges (Ki Points, Rage, etc.) with visual checkboxes
- **Attacks.jsx** - Attack/spell actions with calculated to-hit and save DC
- **Actions.jsx** - Bonus actions and special actions with calculated save DC
- **Equipment.jsx** - Currency and inventory items with a computed running weight total
- **Spells.jsx** - Spell slots and prepared spells by level

#### 4. **Calculation Helper Components**
- **SavesAndSkills.jsx** - Saving throws and skill checks with auto-calculations

#### 5. **Modal/Dialog Components**
- **ConfirmModal.jsx** - Confirmation dialog for destructive actions (used for Clear Sheet)

### Component Prop Pattern

**Display/Field Components** (single data section):
- Receive a `data` prop (or similarly-named slice) with their section of the state
- Receive an `onChange` callback function
- Call `onChange('path.to.field', value)` when users edit inputs
- No local state management - entirely controlled by parent

**List Components** (array data):
- Receive an array (e.g. `attacks`, `charges`, or `data.items`) from state
- Often receive additional context like `attributes` or `proficiency` for calculations
- Have internal functions to add, update, delete, and reorder items
- Call `onChange('arrayPath', newArray)` to replace the entire array when items change
- Each item has a unique `id` (`Date.now()` at creation time) for React keys
- Support move-up/move-down operations for reordering

This pattern keeps the component tree simple and makes state flow predictable - all data flows down as props, all changes flow up through the onChange callback.

---

## Component Breakdown

### 1. App.jsx
**Responsibility:** Main application container

**Key Functions:**
- `getDefaultState()` - Returns the complete default character state structure
- `getInitialState()` - Loads saved state from localStorage, merges with defaults
- `mergeWithDefaults()` - Deep merge for loading backups (ensures no missing fields)
- `updateCharacter()` - Generic path-based state updater
- `saveBackup()` - Downloads character as JSON file
- `loadBackup()` - Loads character from JSON file (with file picker)
- `clearSheet()` / `handleClearConfirm()` / `handleClearCancel()` - Resets character to blank state, gated by `ConfirmModal`

**State Variables:**
- `character` - The entire character data object
- `currentPage` - Current page being displayed (`'attributes' | 'overview' | 'equipment' | 'spells' | 'notes'`)
- `sidebarOpen` - Boolean for mobile sidebar visibility
- `showClearConfirm` - Boolean for clear confirmation modal

**Auto-Save Mechanism:**
- `useEffect` hook debounces saves for 1000ms after character changes
- Catches errors and logs feedback to console

### 2. Sidebar.jsx
**Responsibility:** Navigation and options menu

**Props:**
- `isOpen` - Modal state for mobile
- `onClose` - Handler to close sidebar
- `currentPage` - Current active page for highlighting
- `onPageChange` - Handler to change pages
- `onClearSheet`, `onSaveBackup`, `onLoadBackup` - Action handlers

**Features:**
- Mobile-friendly slide-out sidebar with overlay
- Active page highlighting
- Options section with Clear, Save, Load buttons
- Info & Help section explaining autosave/backup behavior

### 3. CharacterBasicInfo.jsx
**Responsibility:** Character name and the always-visible header stat row

**Data Fields:** Character name; Level, Experience, Inspiration; AC, Hit Points (Temp/Current/Max), Speed, Size; Proficiency (read-only), Initiative (editable, see [Known Quirks](#known-quirks--dead-code)), Passive Perception (read-only)

**Pattern:** Small local `StatBox`/`HPBox` helper components render each stat; simple inputs plus two computed read-only fields, no local state

### 4. Attributes.jsx
**Responsibility:** Race/Background/Class info and the six core attributes

**Sections:**
- "Class & Background" card: Race/Species, Background (text inputs), Class Info (free-text textarea, not a structured multiclass list)
- "Attributes" card: STR/DEX/CON/INT/WIS/CHA inputs with an auto-calculated modifier shown under each

**Key Calculation:**
- `calculateMod()` - Converts attribute score to modifier using D&D formula: `floor((score - 10) / 2)`

**Pattern:** Uses `useMemo` for the six modifiers. Does not compute or display proficiency, initiative, AC, or passive perception — those live in CharacterBasicInfo.jsx.

### 5. Status.jsx
**Responsibility:** Hit dice, death saves, conditions, boons (HP itself lives in CharacterBasicInfo.jsx, not here)

**Key Features:**
- Hit Dice tracker (Current/Max)
- Death Save checkboxes (3 success, 3 failure)
- Conditions and Boons text areas

**Logic:**
- `toggleDeathSave()` - Clicking a checkbox fills up to that box; clicking the last filled one clears the row

### 6. SavesAndSkills.jsx
**Responsibility:** Saving throws and skill checks with auto-calculations

**Key Features:**
- 6 Saving Throws (one per attribute) with proficiency checkboxes and calculated bonus
- 18 Skills grouped under their governing attribute, each cycling None → Proficient → Expert on click, with calculated bonus
- Also computes Spell DC and writes it to `topBar.spellDC` — but does not render a Spell DC/Spell Attack field itself (see [Known Quirks](#known-quirks--dead-code))

**Calculations:**
- **Save bonus** = Attribute Mod + (Proficiency Bonus, if proficient)
- **Skill bonus** = Attribute Mod + (Proficiency × 1 for proficient, × 2 for expertise)

**Data Structure:**
```javascript
skills: {
  athletics: { prof: false, expert: false },  // one entry per skill, 18 total
}
```

### 7. Proficiencies.jsx
**Responsibility:** Armor, weapons, weapon masteries, tools, languages

**Fields:**
- Armor: Light/Medium/Heavy/Shields checkboxes
- Weapons: Simple/Martial checkboxes
- Weapon Masteries (textarea)
- Tools (textarea)
- Languages (textarea)

### 8. FeaturesTraits.jsx
**Responsibility:** Feats, racial traits, class features, background features

**Fields:** Four separate textareas, one per category (not a single combined text area)

### 9. Charges.jsx
**Responsibility:** Track resources and charges (Ki Points, Rage, etc.)

**What it does:** Manages a list of reusable resources with a max capacity (capped at 100). Each resource has a name, max value, a notes field, and current usage tracked via checkboxes rendered up to `max`. Users can add resources, set max capacity, toggle usage boxes, reorder (move up/down), and delete.

**Data structure:** Array where each item has `id`, `name`, `max`, `current`, `notes`.

### 10. Attacks.jsx
**Responsibility:** Track weapon/spell attacks with calculated to-hit bonuses and save DCs

**What it does:** Manages a list of attacks. For each, users input a name, pick an ability (STR-CHA or `custom`), choose Attack Roll vs. Save DC, toggle whether proficiency bonus applies (`addProf`), and fill in damage and a free-text notes field. The Hit/DC column is auto-calculated and read-only unless `stat` is `custom`, in which case it becomes an editable field backed by `manualHit`/`manualDC`.

**How calculations work:** Attack Roll = Ability Modifier + (Proficiency Bonus if `addProf`). Save DC = 8 + spellcasting-ability Modifier + Proficiency Bonus (uses the character's `spellCasting` ability, not the row's own `stat`, for save DC).

### 11. Actions.jsx
**Responsibility:** Track bonus actions, reactions, and special abilities that key off a save DC rather than an attack roll

**What it does:** Same shape as Attacks but simpler — name, stat (STR-CHA or `custom`), an auto-calculated Save DC (or manual when `stat` is `custom`), and a description field. No separate "attack roll" mode.

### 12. Equipment.jsx
**Responsibility:** Currency and inventory management

**What it does:** A currency section (CP/SP/EP/GP/PP) plus Carrying Capacity and Encumbrance (both manual text fields), and an inventory items table (name + weight). "Current Weight" is auto-calculated as the sum of item weights and displayed read-only — it is not stored in state, just derived on render.

### 13. Spells.jsx
**Responsibility:** Spell management by level with prepared-spell tracking

**What it does:** A "Spell Info" card (Spellcasting Ability select, calculated Spell DC/Spell Attack, Spellcasting Class text field) plus a spell list organized into levels (Cantrips through Level 9) via a shared internal `SpellLevel` component. For each level ≥ 1: a slot-count input that resizes a boolean `slots` array, and checkboxes for each slot. Each spell has a name, an optional wiki link (with a button to open it), and — for leveled spells only — a three-state "prepared" indicator (`none` → `prepared` → `always`, cycled by clicking). Cantrips have no slots and no prepared state.

**Key challenge:** Spell slots are boolean arrays sized by `slotCounts[level]`; `toggleSlot` fills/clears from the clicked box outward rather than toggling a single box, so slots are always used from the left.

### 14. Backstory.jsx
**Responsibility:** Character personality, ideals, bonds, flaws, backstory, appearance, allies/NPCs

**What it does:** A "Personality" card (Traits/Ideals/Bonds/Flaws in a grid) and a "Backstory" card (Backstory, Appearance, and a full-width Allies & Organizations textarea). Pure data entry, rendered on the `notes` page alongside Notes.jsx.

### 15. Notes.jsx
**Responsibility:** Two free-form note areas for player notes

**What it does:** Two large textareas (`notes1`, `notes2`), rendered above Backstory on the `notes` page.

### 16. ConfirmModal.jsx
**Responsibility:** Confirmation dialog for destructive actions

**What it does:** Reusable modal accepting `isOpen`, `title`, `message` (newline-split into `<br>`s), `onConfirm`, `onCancel`. Currently only wired up for Clear Sheet.

---

## Data Persistence

### Auto-Save Mechanism
1. **Trigger:** Every time `character` state changes
2. **Debounce:** Waits 1 second after last change before saving (prevents excessive writes)
3. **Storage:** Saves JSON to browser's `localStorage` under key `'dnd_character_sheet_autosave'`
4. **Error Handling:** Catches and logs errors to console, doesn't break the app

A useEffect hook monitors the character state and sets a timeout. If the character changes again before the timeout fires, the previous timeout is cleared and a new one starts. This ensures saves only happen when the user pauses typing/editing.

### Load from Storage
On app startup, the initialization function checks for a saved character in localStorage. If found, it loads that data and merges it with the current default state structure via `mergeWithDefaults`. This merge ensures that if new fields were added (from version updates), they get default values instead of causing undefined errors.

If the saved data is corrupted, the localStorage entry is cleared and the app starts fresh with a blank sheet.

### Backup System
**Save Backup:** Downloads the character as a JSON file (filename includes character name, falling back to `character-backup.json`).

**Load Backup:** User selects a JSON file, which is parsed and merged with the default state structure the same way as the localStorage load path. The loaded data immediately overwrites the current character and saves to localStorage.

### Merge with Defaults
`mergeWithDefaults(defaults, uploaded)` is a recursive function that ensures all required fields exist before the app tries to use them. When loading old saved data or user backups, fields might be missing (especially from app updates that add new features). It walks `defaults`, takes each field from `uploaded` when present, and otherwise falls back to the default value — recursing into plain objects, but taking arrays from `uploaded` as-is (an uploaded array is not merged item-by-item with the default array). This prevents undefined errors and makes backward compatibility mostly automatic — though it's worth knowing it won't repair an individual malformed item inside an array, only a missing array entirely.

---

## File Organization

### Project Structure
```
DnD-Character-Sheet/
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite build config, plus the Vitest `test` block
├── index.html                # HTML entry point
├── README.md                 # Project info
├── .backups/                 # Sample/example character JSON backups (not app code)
├── .github/
│   ├── ISSUE_TEMPLATE/       # Bug / Enhancement / Half-built forms, config.yml
│   ├── pull_request_template.md
│   ├── rulesets/protect-main.json   # Branch-protection policy, committed but NOT applied
│   └── workflows/ci.yml     # One-job CI: conventions, build, test
├── .claude/skills/dnd-dev-cycle/    # The agent-facing half of the dev cycle
├── scripts/ci/               # check-conventions.sh, apply-ruleset.sh
├── docs/
│   ├── PROJECT_DOCUMENTATION.md   # This file
│   ├── BRANDING.md                # Color palette & styling conventions
│   └── workflow.md                # The dev cycle, human-facing half
│
└── src/
    ├── main.jsx            # React entry point (mounts App)
    ├── index.css           # Global styles, CSS variables
    ├── App.jsx             # Main app container
    ├── App.css             # Bulk of the app's styles
    ├── App.test.jsx        # Page-routing + saved-data resilience smoke tests
    ├── test/setup.js       # Vitest/RTL matcher setup
    │
    └── components/
        ├── Sidebar.jsx
        ├── CharacterBasicInfo.jsx
        ├── Attributes.jsx           (+ Attributes.test.jsx)
        ├── Status.jsx
        ├── SavesAndSkills.jsx
        ├── Proficiencies.jsx
        ├── FeaturesTraits.jsx
        ├── Charges.jsx
        ├── Attacks.jsx               (+ Attacks.test.jsx)
        ├── Actions.jsx
        ├── Equipment.jsx
        ├── Spells.jsx
        ├── Backstory.jsx
        ├── Notes.jsx
        ├── ConfirmModal.jsx
        └── ConfirmModal.css    # The only component with its own CSS file
```

(Line counts and a component-to-file size table are deliberately omitted here — they go stale the moment anyone edits a file. Use your editor/`wc -l` if you need current sizes.)

---

## Adding Features & Refactoring

### Patterns for Common Expansions

#### Adding a Simple Field
1. Add the field to the default state in `App.jsx` with an empty string or default value
2. Find or create the appropriate component file
3. Add an input element bound to that state field via the `onChange` callback
4. Done - auto-save handles persistence automatically

#### Adding a Calculated Field
1. Create a calculation function inside the component
2. Use `useMemo` to optimize the calculation (depends on the values it uses)
3. Render as a read-only input with the `auto-filled` CSS class
4. Pass the dependencies to `useMemo` so it recalculates when inputs change

Key insight: Don't store calculated values in state - calculate them on each render from their dependencies. This prevents sync issues when dependencies change. (`topBar.proficiency` and `topBar.spellDC` are exceptions that *do* get written to state so other components can read them via props — but note `topBar.spellDC` currently has no reader; see [Known Quirks](#known-quirks--dead-code).)

#### Adding a Dynamic List
1. Add the array to the default state in `App.jsx`
2. Create a new component that accepts the array and an `onChange` callback
3. Implement add, update, delete, and reorder functions that replace the entire array
4. Each item needs a unique `id` (typically `Date.now()`) for React keys
5. Render the list as a table or div structure with input fields
6. Include move-up/move-down buttons for reordering

Follow the pattern already used in Attacks.jsx, Charges.jsx, Equipment.jsx, etc.

#### Adding a New Page
1. Add a new property to the `character` state in `App.jsx` if needed
2. Create the component file(s) in `src/components/`
3. Add a navigation link in `Sidebar.jsx` with a new `currentPage` value
4. Add a conditional render block in `App.jsx` (`{currentPage === '...' && ...}`) that shows the component(s)
5. The new component receives its data and the `onChange` callback like all others

### Code Organization Patterns

**Common UI Patterns:**
- Input sections use the `.info-group` / `.form-group` classes for label-input styling
- List items use up/down/delete button patterns (`.action-buttons`) - used in Attacks, Actions, Charges, Equipment, Spells
- Calculations use `useMemo` for optimization - found in Attributes, SavesAndSkills, Attacks, Actions
- Spells.jsx includes a nested `SpellLevel` component that handles the differences between cantrips and leveled spells

**State Structure Conventions:**
- State properties use camelCase naming
- Related fields are grouped in objects (not flattened)
- Dynamic collections are stored as arrays
- All field definitions exist in `getDefaultState()` for proper merge-with-defaults behavior

---

## Styling System

### CSS Architecture
- **Global Styles** in `index.css` - CSS variables, base element styles (inputs, checkboxes, buttons, `.locked-field`/`.auto-filled`)
- **App Styles** in `App.css` - Layout, sidebar, cards, and nearly all component-specific styling
- **Component Styles** - Only `ConfirmModal.css` exists as a separate file; every other component's styles live in `App.css`

See [BRANDING.md](BRANDING.md) for the full color palette and the rules for reusing tokens (no new color variables for minor variations — use `filter: brightness()` and `opacity` instead).

### Key Classes
- `.card` - Container for sections (padding, border, background)
- `.section-title` - Section headings
- `.info-group` / `.form-group` - Label + input pair
- `.auto-filled` / `.locked-field` - Styling for calculated/read-only fields (gold outline, dimmed background)
- `.two-column-layout` - Two-column grid layout
- `.action-buttons` - Group of move-up/move-down/delete controls
- `.sidebar`, `.sidebar.open` - Sidebar styling and animation
- `.page` - Page container for routing

### Responsive Design
- Mobile-first approach
- Sidebar slides from left on mobile, with an overlay
- Grid layouts adapt to screen size via media queries in `App.css`

---

## Known Quirks & Dead Code

Worth knowing before you touch the header stats, spellcasting math, or `basicInfo`:

- **Unused `basicInfo` fields:** `level`, `levelTwo`, `playerName`, `alignment`, `deity` are all defined in `getDefaultState()` but have no corresponding input anywhere in the component tree. If you're asked to add a player-name or alignment field, the state slot already exists — just wire up the UI.
- **`topBar.initiative` is manual, not calculated:** `CharacterBasicInfo.jsx` computes `const initiative = calculateMod(attributes?.dex || 10)` but never uses that variable — the rendered Initiative field is a plain editable input bound to `topBar.initiative`. If initiative is supposed to auto-calculate from DEX, that wiring needs to be added; don't assume it already works.
- **`topBar.spellDC` is write-only:** `SavesAndSkills.jsx` calculates a spell DC and pushes it into `topBar.spellDC`, but nothing reads that state field. The Spell DC actually shown to the user (on the Spells page) is computed independently by `Spells.jsx` from the same inputs. The two calculations should currently agree in value, but they are two separate code paths, not one shared source of truth.
- **`calculateSpellBonus` in `SavesAndSkills.jsx` is dead code:** it's computed but never rendered or written to state.
- **`mergeWithDefaults` doesn't deep-merge arrays:** an uploaded/saved array (e.g. `attacks`, `spells.cantrips`) is taken as-is if present at all, not merged item-by-item against the default shape. A missing array falls back to the default (usually `[]`); a malformed item inside a present array is not repaired.
- **This doc was previously out of date** on the page-routing structure (it described a page layout that no longer matches `App.jsx`/`Sidebar.jsx`) and on several component descriptions and file line-counts. If something here ever looks inconsistent with the source, trust the source — `App.jsx` and `Sidebar.jsx` in particular — over this document, and update this file when you find the drift.

---

## Summary

This D&D Character Sheet application is built with **React 18** and **Vite**, using a **centralized state management** pattern with **component-based architecture**.

**Key Technical Decisions:**
1. **Single centralized state** - Easier to manage and persist
2. **Path-based updates** - Flexible, allows deep nesting without boilerplate
3. **Auto-save with debounce** - User never loses data, no manual save button
4. **Component composition** - Each section is independent, easy to modify
5. **Immutable state** - Prevents bugs, enables React optimization

**When working with this codebase:**
- Use the component patterns as templates when modifying or extending features
- Follow the state structure conventions closely to maintain consistency
- Test thoroughly after changing state structure (especially backup/load, since `mergeWithDefaults` behavior around arrays is easy to get wrong)
- Keep styling consistent with the CSS variables and classes in [BRANDING.md](BRANDING.md)
- Re-verify anything in this doc against the actual source before relying on it for something structural — see [Known Quirks](#known-quirks--dead-code)
