# D&D Character Sheet - Branding & Theme Guidelines

## Overview
This application uses a **Dark Medieval Fantasy** theme with a **simplified, minimal color palette**. Every color serves a purpose and is reused throughout the app for consistency.

---

## Simplified Color Palette

### Core Colors (10 Total)
| Variable | Hex Code | Usage | Preview |
|----------|----------|-------|---------|
| `--bg-primary` | `#1a1410` | Main backgrounds, input fields | ![#1a1410](https://via.placeholder.com/50x20/1a1410/1a1410.png) |
| `--bg-secondary` | `#2a2118` | Cards, sections, sidebar, spell items | ![#2a2118](https://via.placeholder.com/50x20/2a2118/2a2118.png) |
| `--bg-light` | `#d4a574` | Modals (parchment color for emphasis) | ![#d4a574](https://via.placeholder.com/50x20/d4a574/d4a574.png) |
| `--text-light` | `#e8d4b0` | All text on dark backgrounds | ![#e8d4b0](https://via.placeholder.com/50x20/e8d4b0/e8d4b0.png) |
| `--text-dark` | `#2c1810` | Text on light backgrounds (modals) | ![#2c1810](https://via.placeholder.com/50x20/2c1810/2c1810.png) |
| `--accent` | `#d4af37` | Gold - buttons, highlights, active states | ![#d4af37](https://via.placeholder.com/50x20/d4af37/d4af37.png) |
| `--border` | `#4a3f2f` | All borders throughout the app | ![#4a3f2f](https://via.placeholder.com/50x20/4a3f2f/4a3f2f.png) |
| `--success` | `#5a8f5a` | Add buttons, success states | ![#5a8f5a](https://via.placeholder.com/50x20/5a8f5a/5a8f5a.png) |
| `--danger` | `#8f3a3a` | Delete buttons, warnings | ![#8f3a3a](https://via.placeholder.com/50x20/8f3a3a/8f3a3a.png) |
| `--neutral` | `#6c757d` | Cancel buttons, disabled states | ![#6c757d](https://via.placeholder.com/50x20/6c757d/6c757d.png) |
| `--shadow` | `rgba(0, 0, 0, 0.5)` | Drop shadows everywhere |

---

## How Colors Are Reused

### Backgrounds
- **Dark areas**: Use `--bg-primary`
- **Raised surfaces** (cards, sidebar): Use `--bg-secondary`  
- **Emphasis areas** (modals): Use `--bg-light`
- **Variations**: Use `filter: brightness()` to lighten/darken instead of new colors

### Text
- **On dark backgrounds**: Always use `--text-light`
- **On light backgrounds**: Always use `--text-dark`
- **Muted text**: Use `--text-light` with `opacity: 0.7`

### Accents
- **Primary actions** (menu, links, highlights): Use `--accent` (gold)
- **Success actions** (add buttons): Use `--success` (green)
- **Destructive actions** (delete): Use `--danger` (red)
- **Neutral actions** (cancel): Use `--neutral` (gray)

### Borders
- **Everything**: Use `--border`
- No separate highlight borders - use brightness or accent color

### Hover States
Instead of defining new hover colors, use:
```css
.element:hover {
  filter: brightness(1.15);  /* Lighten by 15% */
}
```

---

## Typography

- **Headings**: `'Cinzel', serif` - Medieval-inspired 
- **Body/Inputs**: `'EB Garamond', serif` - Classic, readable

---

## Implementation Rules

### ✅ DO
```css
/* Use variables */
background: var(--bg-secondary);
color: var(--text-light);
border: 1px solid var(--border);

/* Use filter for variations */
.element:hover {
  filter: brightness(1.2);
}

/* Use opacity for muted text */
.label {
  color: var(--text-light);
  opacity: 0.7;
}
```

### ❌ DON'T
```css
/* Don't hardcode colors */
background: #2a2118;

/* Don't create new color variables for slight variations */
--bg-card-hover: #332820;  /* Just use filter: brightness() */

/* Don't make separate variables for similar uses */
--border-color: #4a3f2f;
--border-highlight: #6b5940;  /* Just use one --border */
```

---

## Benefits of Simplified System

1. **Easier to maintain** - Change one variable, update entire theme
2. **Smaller CSS** - No redundant color definitions
3. **Consistent** - Automatic harmony across all components
4. **Flexible** - `filter: brightness()` creates infinite variations
5. **Clear purpose** - Each color has one obvious use case

---

*Last Updated: February 2026*

