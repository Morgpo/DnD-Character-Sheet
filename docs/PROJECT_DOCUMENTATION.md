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

---

## Project Overview

**Project Name:** D&D 5th Edition Character Sheet  
**Version:** 2.0 (React version)  
**Purpose:** A web-based character sheet for Dungeons & Dragons 5th Edition that allows players to create, manage, and save character data locally in their browser.

### Key Features
- **Auto-Save:** Character data automatically saves to browser local storage every 1 second after user input
- **Import/Export:** Save character data as JSON files and load them back
- **Dynamic Calculations:** Auto-calculates modifiers, proficiency bonuses, spell DC, armor class bonuses, etc.
- **Page-Based Navigation:** Multiple sections organized as logical "pages" (Attributes, Equipment, Spells, Backstory, Notes)
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
- **Build Tool:** Vite 6.0.3 - Fast, modern module bundler for React
- **React Plugin:** @vitejs/plugin-react 4.3.4 - Enables JSX and Fast Refresh
- **Type Support:** @types/react and @types/react-dom for TypeScript support (optional)

### How to Run
```bash
npm install          # Install dependencies
npm run dev         # Start dev server (usually http://localhost:5173)
npm run build       # Build for production
npm run preview     # Preview built app
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
    │   └── CharacterBasicInfo (Always visible)
    │   └── Page-Based Components
    │       ├── Page: Attributes
    │       │   ├── Attributes
    │       │   ├── Status
    │       │   ├── SavesAndSkills
    │       │   ├── Proficiencies
    │       │   ├── FeaturesTraits
    │       │   ├── Charges
    │       │   ├── Attacks
    │       │   └── Actions
    │       ├── Page: Equipment
    │       │   └── Equipment
    │       ├── Page: Spells
    │       │   └── Spells
    │       ├── Page: Backstory
    │       │   └── Backstory
    │       └── Page: Notes
    │           └── Notes
    │
    └── Footer & Utility Buttons
```

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

The state is organized into logical sections matching the UI components:

- **basicInfo** - Character name, class, race, background, player name, alignment, deity, level, experience
- **topBar** - Quick stats like proficiency bonus, initiative, passive perception, AC, speed, spell DC
- **attributes** - The six core ability scores (STR, DEX, CON, INT, WIS, CHA) ranging 3-20
- **status** - Health tracking (current/temp/max HP), hit dice, death saves, conditions, boons
- **saves** - Saving throw proficiency boolean for each ability (STR-CHA)
- **skills** - 18 skills, each with proficiency and expertise flags
- **spellCasting** - Which ability governs spell attacks/DC (ability name or 'none')
- **proficiencies** - Armor, weapons, tools, and language proficiencies (text fields)
- **features** - Special features and traits
- **charges** - Dynamic list of resources like Ki Points or Rage (tracked with current/max)
- **attacks** - Dynamic list of weapon/spell attacks with ability modifiers, attack types, damage
- **actions** - Dynamic list of bonus actions and special abilities
- **equipment** - Currency (CP, SP, EP, GP, PP), inventory items with weight, capacity, encumbrance
- **spells** - Spell class, spell slots by level (as used/unused arrays), cantrips and leveled spells with prepared flags
- **backstory** - Personality traits, ideals, bonds, flaws, physical description, backstory, allies/NPCs
- **notes** - Two free-form text areas for player notes

### State Update Pattern

App.jsx uses a generic **path-based update function** that accepts a dot-notation string and a value. This allows components to update any nested property without needing specialized update functions for each field.

**How it works:**
- Components call `onChange('path.to.field', value)` with a dot-notation path
- The function splits the path and navigates through the nested object structure
- It creates new object references at each level to maintain immutability (required by React)
- This works for simple fields like `'basicInfo.charName'` or array items like `'attacks.2.damage'`

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
These components receive a portion of the state and render a specific section:

- **CharacterBasicInfo.jsx** - Character name, class, race, background, etc.
- **Attributes.jsx** - Core attributes (STR, DEX, CON, INT, WIS, CHA) with auto-calculated modifiers
- **Status.jsx** - HP, hit dice, death saves, conditions, boons
- **Proficiencies.jsx** - Armor, weapons, tools, languages
- **FeaturesTraits.jsx** - Special features and traits (text area)
- **Notes.jsx** - Two text areas for miscellaneous notes

#### 3. **Dynamic List Components**
These components manage arrays of items with add/remove/reorder functionality:

- **Charges.jsx** - Resources and charges (Ki Points, Rage, etc.) with visual checkboxes
- **Attacks.jsx** - Attack/spell actions with calculated to-hit and damage
- **Actions.jsx** - Bonus actions and special actions
- **Equipment.jsx** - Currency and inventory items with weight calculation
- **Spells.jsx** - Spell slots and prepared spells by level

#### 4. **Calculation Helper Components**
- **SavesAndSkills.jsx** - Saving throws and skill checks with auto-calculations

#### 5. **Modal/Dialog Components**
- **ConfirmModal.jsx** - Confirmation dialog for destructive actions

### Component Prop Pattern

**Display/Field Components** (single data section):
- Receive a `data` prop with their section of the state
- Receive an `onChange` callback function
- Call `onChange('path.to.field', value)` when users edit inputs
- No local state management - entirely controlled by parent

**List Components** (array data):
- Receive an `items` array from state
- Often receive additional context like `attributes` or `proficiency` for calculations
- Have internal functions to add, update, delete, and reorder items
- Call `onChange('items', newArray)` to replace the entire array when items change
- Each item has a unique `id` (usually timestamp) for React keys
- Support move-up/move-down operations for reordering

This pattern keeps the component tree simple and makes state flow predictable - all data flows down as props, all changes flow up through the onChange callback.

---

## Component Breakdown

### 1. App.jsx (406 lines)
**Responsibility:** Main application container

**Key Functions:**
- `getDefaultState()` - Returns the complete default character state structure
- `getInitialState()` - Loads saved state from localStorage, merges with defaults
- `mergeWithDefaults()` - Deep merge for loading backups (ensures no missing fields)
- `updateCharacter()` - Generic path-based state updater
- `saveBackup()` - Downloads character as JSON file
- `loadBackup()` - Loads character from JSON file (with file picker)
- `clearSheet()` - Resets character to blank state with confirmation

**State Variables:**
- `character` - The entire character data object
- `currentPage` - Current page being displayed ('attributes', 'equipment', 'spells', 'backstory', 'notes')
- `sidebarOpen` - Boolean for mobile sidebar visibility
- `showClearConfirm` - Boolean for clear confirmation modal

**Auto-Save Mechanism:**
- `useEffect` hook debounces saves for 1000ms after character changes
- Catches errors and logs feedback to console

### 2. Sidebar.jsx (63 lines)
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
- Info section with help text

### 3. CharacterBasicInfo.jsx (67 lines)
**Responsibility:** Character name, class, race, level, player info

**Data Fields:**
- Character name, current level, class, multiclass
- Race, background, player name
- Experience, alignment, deity

**Pattern:** Simple text inputs with labels, no calculations

### 4. Attributes.jsx (88 lines)
**Responsibility:** Core attributes and derived statistics

**Key Calculations:**
- `calculateMod()` - Converts attribute score (3-20) to modifier using D&D formula: `(score - 10) / 2`
- **Proficiency Bonus** - Auto-calculated: `ceil(level / 4) + 1`
- **Initiative** - Dexterity modifier
- **Passive Perception** - 10 + Wisdom modifier

**Auto-Filled Fields:**
- Proficiency, Initiative, Passive Perception (read-only, calculated)

**Manual Fields:**
- Attribute scores (STR, DEX, CON, INT, WIS, CHA)
- AC, Speed, Inspiration

**Pattern:** Uses `useMemo` for calculations, `useEffect` to auto-update proficiency when level changes

### 5. Status.jsx (109 lines)
**Responsibility:** Health, hit dice, death saves, conditions

**Key Features:**
- HP fields (Temporary, Current, Max)
- Hit Dice tracker (Current/Max)
- Death Save checkboxes (3 success, 3 failure)
- Conditions and Boons text areas

**Logic:**
- `toggleDeathSave()` - Toggles death save checkboxes (clicking 4 times resets)

### 6. SavesAndSkills.jsx (201 lines)
**Responsibility:** Saving throws and skill checks with calculations

**Key Features:**
- 6 Saving Throws (one per attribute) with proficiency checkboxes
- 18 Skills with proficiency levels (None, Proficient, Expert)
- Spell DC and Spell Attack Bonus calculations (if spellcasting enabled)

**Calculations:**
- **Save DC** = 8 + Attribute Mod + Proficiency Bonus
- **Skill Modifier** = Attribute Mod + (Proficiency × 1 or 2 for expertise)
- **Spell Casting** - Determines which attribute is used for spell calculations

**Data Structure:**
```javascript
skills: {
  athleticcs: { prof: false, expert: false },  // One for each skill
}
```

**Pattern:** Maps over skill names, calculates modifiers with useMemo

### 7. Proficiencies.jsx (variable lines)
**Responsibility:** Armor, weapons, tools, languages

**Fields:**
- Languages (text area)
- Armor Proficiencies (text area)
- Weapon Proficiencies (text area)
- Tool Proficiencies (text area)

**Pattern:** Simple text areas, no complex logic

### 8. FeaturesTraits.jsx (variable lines)
**Responsibility:** Special features, feats, and class traits

**Fields:**
- Features/Traits (large text area)

**Pattern:** Single text area component

### 9. Charges.jsx (106 lines)
**Responsibility:** Track resources and charges (Ki Points, Rage, etc.)

**What it does:** Manages a list of reusable resources with max capacity. Each resource has a name, maximum value, and current usage tracked via visual checkboxes (up to 20 boxes visible). Users can add unlimited resources, set their max capacity, toggle usage boxes, reorder, and delete.

**Key pattern:** For each resource, displays a row with the name and a number of checkboxes equal to the max value. Clicking checkboxes tracks current usage visually. This is a common pattern in D&D for tracking Ki Points, Rage uses, channel divinity charges, etc.

**Data structure:** Array where each item has an id (for React keys), name string, max number, and current usage count.

### 10. Attacks.jsx (180 lines)
**Responsibility:** Track weapon/spell attacks with calculated to-hit bonuses and save DCs

**What it does:** Manages a list of attacks including both weapon attacks and spell saves. For each attack, users input name, select which ability modifier to use (STR-CHA), choose attack type (attack roll vs. save DC), and specify damage. The component auto-calculates the to-hit bonus or save DC based on the ability, proficiency bonus, and level. Calculations are read-only and update whenever ability scores or proficiency change.

**How calculations work:** Attack Roll = Ability Modifier + Proficiency Bonus. Save DC = 8 + Ability Modifier + Proficiency Bonus. These are calculated from passed-in props (attributes, proficiency) so they're always in sync.

**Key pattern:** Uses memoization to avoid recalculating modifiers on every render. Handles both attack and save mechanics in one flexible component.

### 11. Actions.jsx
**Responsibility:** Track bonus actions, reactions, and special abilities

**What it does:** Similar structure to Attacks but without calculations. Stores name, description, and notes for special action abilities. Useful for tracking class features like Cunning Action, Metamagic options, Sneak Attack, etc.

**Key difference:** No auto-calculations - purely for documentation purposes.

### 12. Equipment.jsx (165 lines)
**Responsibility:** Currency and inventory management

**What it does:** Two sections - currency tracker (CP, SP, EP, GP, PP) and inventory. For inventory, users add items with names and weights. The component auto-calculates total weight as a helper. Also includes fields for carrying capacity and encumbrance status (though these are manual, not auto-calculated).

**Key pattern:** Demonstrates combining simple input fields (currency) with a list component (items). Auto-calculation of totals without storing the calculated value - it's computed on render from the item weights.

### 13. Spells.jsx (213 lines)
**Responsibility:** Spell management by level with prepared spell tracking

**What it does:** Largest component - organizes spells into levels (cantrips through level 9). For each level, displays:
- Spell slots tracker (checkboxes to mark which slots are used)
- List of known/available spells with prepared checkboxes (for prepared casting)
- Optional wiki links for each spell
- Move and delete buttons for organization

Different logic for cantrips (no slots, no prepared) vs. leveled spells (both applicable).

**Key challenge:** Spell slots are represented as boolean arrays with length = number of slots. Updating slot count requires recreating the array to the new length.

### 14. Backstory.jsx (81 lines)
**Responsibility:** Character personality, ideals, bonds, flaws, backstory, appearance, allies/NPCs

**What it does:** Seven text areas organized in a grid layout for character personality (traits, ideals, bonds, flaws), larger areas for backstory and physical appearance, and an area for important NPCs and organizations. Pure data entry - no calculations or complex logic.

### 15. Notes.jsx
**Responsibility:** Two free-form note areas for player notes

**What it does:** Very simple - two large text areas for miscellaneous notes. Users often use these for houserules, campaign setting notes, or session summaries.

### 16. ConfirmModal.jsx
**Responsibility:** Confirmation dialog for destructive actions

**What it does:** Reusable modal component that accepts title, message, and confirm/cancel handlers. Used for the "Clear Sheet" operation to prevent accidental data loss.

---

## Data Persistence

### Auto-Save Mechanism
1. **Trigger:** Every time `character` state changes
2. **Debounce:** Waits 1 second after last change before saving (prevents excessive writes)
3. **Storage:** Saves JSON to browser's `localStorage` under key `'dnd_character_sheet_autosave'`
4. **Error Handling:** Catches and logs errors to console, doesn't break the app

A useEffect hook monitors the character state and sets a timeout. If the character changes again before the timeout fires, the previous timeout is cleared and a new one starts. This ensures saves only happen when the user pauses typing/editing.

### Load from Storage
On app startup, the initialization function checks for a saved character in localStorage. If found, it loads that data and merges it with the current default state structure. This merge ensures that if new fields were added (from version updates), they get default values instead of causing undefined errors.

If the saved data is corrupted, the localStorage entry is cleared and the app starts fresh with a blank sheet.

### Backup System
**Save Backup:**
Users can download their character as a JSON file (filename includes character name for organization). This creates a permanent backup they can store safely outside the browser.

**Load Backup:**
Users select a previously saved JSON file, which is parsed and merged with the current default state structure. This ensures compatibility even if the character data is from an older version of the app. The loaded data immediately overwrites the current character and saves to localStorage.

### Merge with Defaults
This is a recursive function that ensures all required fields exist before the app tries to use them. When loading old saved data or user backups, fields might be missing (especially from app updates that add new features). The merge function takes each field from the saved data but fills in missing fields from the defaults. This prevents undefined errors and makes backward compatibility automatic.

---

## File Organization

### Project Structure
```
DnD-Character-Sheet/
├── package.json              # Dependencies and scripts
├── vite.config.js           # Vite build configuration
├── index.html               # HTML entry point
├── README.md                # Project info
├── TODO.md                  # Development TODO list
├── docs/
│   └── BRANDING.md         # Brand guidelines
│
└── src/
    ├── main.jsx            # React entry point (mounts App)
    ├── index.css           # Global styles
    ├── App.jsx             # Main app container (406 lines)
    ├── App.css             # Main styles (941 lines)
    │
    └── components/         # React components
        ├── Sidebar.jsx              # Navigation menu
        ├── CharacterBasicInfo.jsx   # Name, class, race, etc.
        ├── Attributes.jsx           # Core attributes and derived stats
        ├── Status.jsx               # HP, hit dice, death saves
        ├── SavesAndSkills.jsx       # Saving throws and skill checks
        ├── Proficiencies.jsx        # Armor, weapons, tools
        ├── FeaturesTraits.jsx       # Special features
        ├── Charges.jsx              # Resources and charges
        ├── Attacks.jsx              # Attack and spell actions
        ├── Actions.jsx              # Bonus actions
        ├── Equipment.jsx            # Currency and inventory
        ├── Spells.jsx               # Spell management
        ├── Backstory.jsx            # Character personality and history
        ├── Notes.jsx                # Free-form notes
        ├── ConfirmModal.jsx         # Confirmation dialog
        ├── ConfirmModal.css         # Modal styles
        └── [other].css              # Component-specific styles (if any)
```

### Component-to-File Mapping
| Component | File | Size | Purpose |
|-----------|------|------|---------|
| App | App.jsx | 406 L | Main container, state, page routing |
| Sidebar | Sidebar.jsx | 63 L | Navigation & options |
| CharacterBasicInfo | CharacterBasicInfo.jsx | 67 L | Character info fields |
| Attributes | Attributes.jsx | 88 L | Stats with calculations |
| Status | Status.jsx | 109 L | HP and death saves |
| SavesAndSkills | SavesAndSkills.jsx | 201 L | Saves and skills |
| Proficiencies | Proficiencies.jsx | ? | Proficiency text areas |
| FeaturesTraits | FeaturesTraits.jsx | ? | Features text area |
| Charges | Charges.jsx | 106 L | Resource tracker |
| Attacks | Attacks.jsx | 180 L | Attack list with math |
| Actions | Actions.jsx | ? | Action list |
| Equipment | Equipment.jsx | 165 L | Inventory management |
| Spells | Spells.jsx | 213 L | Spell management |
| Backstory | Backstory.jsx | 81 L | Personality traits |
| Notes | Notes.jsx | ? | Free-form notes |
| ConfirmModal | ConfirmModal.jsx | ? | Confirmation dialog |

### CSS Organization
- **App.css** - Main stylesheet (941 lines)
  - Sidebar styles
  - Button styles
  - Layout and grid styles
  - Component-specific styling
- **ConfirmModal.css** - Modal styling
- **index.css** - Global styles, CSS variables
- Component-specific CSS may be in same file or separate

---

## Adding Features & Refactoring

### Patterns for Common Expansions

#### Adding a Simple Field
To add a new text/number field (like "Hometown" to character info):
1. Add the field to the default state in `App.jsx` with an empty string or default value
2. Find or create the appropriate component file (or create a new one)
3. Add an input element bound to that state field via the `onChange` callback
4. Done - auto-save handles persistence automatically

#### Adding a Calculated Field
To add an auto-calculated value (like a derived stat):
1. Create a calculation function inside the component
2. Use `useMemo` to optimize the calculation (depends on the values it uses)
3. Render as a read-only input with the `auto-filled` CSS class
4. Pass the dependencies to useMemo so it recalculates when inputs change

Key insight: Don't store calculated values in state - calculate them on each render from their dependencies. This prevents sync issues when dependencies change.

#### Adding a Dynamic List
To create a new list component (attacks, items, spells, charges, etc.):
1. Add the array to the default state in `App.jsx`
2. Create a new component that accepts the array and an `onChange` callback
3. Implement add, update, delete, and reorder functions that replace the entire array
4. Each item needs a unique `id` (typically `Date.now()`) for React keys
5. Render the list as a table or div structure with input fields
6. Include move-up/move-down buttons for reordering

Follow the pattern already used in Attacks.jsx, Charges.jsx, Equipment.jsx, etc.

#### Adding a New Page
To add a new major section of the character sheet:
1. Add a new property to the `character` state in `App.jsx`
2. Create the component file(s) in `src/components/`
3. Add a navigation link in `Sidebar.jsx` with a new page name
4. Add a conditional render block in `App.jsx` that shows the component when `currentPage` matches
5. The new component receives its data and the `onChange` callback like all others

### Code Organization Patterns

**Common UI Patterns:**
- Input sections use the `.info-group` class for label-input styling - see CharacterBasicInfo and Backstory
- List items use up/down/delete button patterns - used in Attacks, Charges, and Equipment
- Calculations use `useMemo` for optimization - found in Attributes and SavesAndSkills
- Spells.jsx includes a nested `SpellLevel` component that handles logic differences between cantrips and leveled spells

**State Structure Conventions:**
- State properties use camelCase naming
- Related fields are grouped in objects (not flattened)
- Dynamic collections are stored as arrays
- All field definitions exist in `getDefaultState()` for proper merge-with-defaults behavior

---

## Styling System

### CSS Architecture
- **Global Styles** in `index.css` - CSS variables, base styles
- **App Styles** in `App.css` - Main layout, components, utilities
- **Component Styles** in dedicated CSS files when needed (e.g., `ConfirmModal.css`)

### CSS Variables (Common Tokens)
Look in `index.css` for:
- `--bg-primary`, `--bg-secondary` - Background colors
- `--text-light`, `--text-dark` - Text colors
- `--accent` - Accent color (gold for D&D theme)
- `--border`, `--shadow` - UI element styling

### Key Classes
- `.card` - Container for sections (padding, border, background)
- `.section-title` - Section headings
- `.info-group` - Label + input pair with floating label animation
- `.auto-filled` - Special styling for calculated/read-only fields
- `.two-column-layout` - Two-column grid layout
- `.action-buttons` - Group of control buttons (move, delete)
- `.sidebar`, `.sidebar.open` - Sidebar styling and animation
- `.page` - Page container for routing

### Responsive Design
- Mobile-first approach
- Sidebar slides from left on mobile
- Grid layouts adapt to screen size
- Uses media queries in CSS

---

## Implementation Patterns

### How Features Are Structured

Every feature in this application follows consistent patterns:

**Simple Fields** (like character name, alignment, etc.):
- Defined in the state object with an empty string or default value
- Rendered with an input element that uses `onChange` callback
- Automatically saved by the auto-save mechanism

**Calculated Fields** (like proficiency bonus, passive perception):
- Defined as functions within the component that compute from other values
- Wrapped with `useMemo` to prevent unnecessary recalculations
- Rendered as read-only inputs with the `auto-filled` CSS class
- Automatically update when their dependencies change

**Dynamic Lists** (attacks, spells, equipment, charges):
- Stored as arrays in the state object
- Each item has a unique `id` for React keys
- Include add, update, delete, and reorder functions
- Replace entire array when items change via `onChange` callback
- Support move-up/move-down buttons for reordering

Examples of each pattern: Simple fields in CharacterBasicInfo, calculated fields in Attributes, dynamic lists in Attacks/Equipment/Charges/Spells.

**Multi-Section Pages:**
- Managed by the `currentPage` state in App.jsx
- Navigation in Sidebar.jsx triggers page changes
- Each page component receives its data section and `onChange` callback
- Examples: Attributes page (multiple components), Equipment page, Backstory page

---

## Development Reference

### Debugging Tips
- **Check Console:** Auto-save logs messages, errors show here
- **LocalStorage:** Open DevTools → Application → Local Storage → `dnd_character_sheet_autosave`
- **State:** Use browser React DevTools to inspect component props and state
- **Save Backup:** Download current character to backup file for testing

### Performance Considerations
- Components use `useMemo` for expensive calculations
- Debounced auto-save prevents excessive localStorage writes
- Immutable state updates keep React re-renders efficient
- Large arrays (spells, items) are handled efficiently with key-based list updates

---

## Summary

This D&D Character Sheet application is built with **React 18** and **Vite**, using a **centralized state management** pattern with **component-based architecture**. 

**Key Technical Decisions:**
1. **Single centralized state** - Easier to manage and persist
2. **Path-based updates** - Flexible, allows deep nesting without boilerplate
3. **Auto-save with debounce** - User never loses data, no manual save button
4. **Component composition** - Each section is independent, easy to test/refactor
5. **Immutable state** - Prevents bugs, enables React optimization

**Architecture provides:**
- **Extensibility** - New fields/sections follow the existing patterns
- **Data persistence** - Auto-save and backup/restore without manual intervention
- **Maintainability** - Clear component responsibilities and predictable data flow
- **User experience** - No data loss, instant feedback, offline-capable

**When working with this codebase:**
- Use the component patterns as templates when modifying or extending features
- Follow the state structure conventions closely to maintain consistency
- Leverage `useMemo` and `useCallback` for expensive operations
- Test thoroughly after changing state structure (especially backup/load)
- Keep styling consistent with existing CSS variables and classes

