# Dark Medieval Theme - Character Sheet Refactor

## Overview
The 5e Character Sheet has been refactored with a dark medieval theme while maintaining excellent readability. The design now features a parchment-inspired color palette with warm, golden accents.

## Color Palette

### Background Colors
- **Primary Dark**: `#2a2419` - Main background
- **Medium**: `#3d3325` - Sidebar and cards
- **Light**: `#4a3f2f` - Hover states
- **Accent**: `#5a4d3a` - Highlights

### Text Colors
- **Primary**: `#e8dcc4` - Main text (excellent contrast)
- **Secondary**: `#d4c5a9` - Supporting text
- **Accent**: `#f4e4bc` - Emphasis text

### Border & Highlights
- **Border**: `#6b5d47` - Standard borders
- **Border Accent**: `#8b7355` - Emphasized borders
- **Gold**: `#c9a961` - Special highlights
- **Amber**: `#d4a76a` - Links and accents

### Input & Card Backgrounds
- **Input BG**: `#33291f` - Form fields
- **Card BG**: `#342b20` - Content cards

## Typography

### Fonts
1. **Cinzel** - Used for headers, labels, and titles (medieval serif)
2. **EB Garamond** - Used for body text (classic readable serif)
3. **Georgia** - Fallback serif font

### Font Features
- Headers use `Cinzel` with increased letter-spacing for medieval feel
- Labels are uppercase with letter-spacing for emphasis
- Body text uses `EB Garamond` at 16px for optimal readability

## Key Design Features

### Visual Elements
1. **Subtle texture overlay** - Adds parchment-like grain
2. **Decorative borders** - Gold gradients on character info sections
3. **Enhanced shadows** - Depth with dark shadows
4. **Rounded corners** - Softer, aged appearance

### Interactive Elements
- **Focus states** - Gold outline (2px) for accessibility
- **Hover effects** - Subtle elevation and color shifts
- **Button animations** - Smooth transitions on interaction
- **Auto-filled fields** - Amber border highlight

### Card Styling
- Dark parchment backgrounds
- Bordered with warm tones
- Box shadows for depth
- Consistent spacing and padding

## Readability Features

### High Contrast
- Text to background ratio exceeds WCAG AA standards
- Light text (`#e8dcc4`) on dark backgrounds (`#2a2419`)
- Important elements use gold/amber for emphasis

### Accessibility
- Clear focus indicators
- Sufficient color contrast
- Readable font sizes (16px base)
- Proper heading hierarchy

### Visual Hierarchy
- Headers and labels in contrasting gold
- Important inputs have enhanced borders
- Section dividers with proper spacing
- Consistent card styling

## Component Updates

### Updated Components
- ✅ Body and base styles
- ✅ Input fields and textareas
- ✅ Buttons and navigation
- ✅ Sidebar and menu
- ✅ Cards and containers
- ✅ Tables and lists
- ✅ Attributes and stats
- ✅ Skills and saves
- ✅ Health and resources
- ✅ Attacks and spells
- ✅ Equipment and inventory
- ✅ Character background
- ✅ Notes sections
- ✅ Footer
- ✅ Scrollbars

## Browser Compatibility

### Supported Features
- CSS Custom Properties (Variables)
- Grid and Flexbox layouts
- Webkit scrollbar styling
- Focus-visible selectors
- CSS animations

### Tested For
- Modern Chrome/Edge
- Firefox
- Safari
- Mobile responsive design maintained

## Files Modified

1. **css/app.css** - Complete dark theme implementation
2. **index.html** - Added Google Fonts links for Cinzel and EB Garamond

## Usage Notes

### Maintaining Theme
- All color values use CSS custom properties (variables)
- Easy to adjust by modifying `:root` variables
- Consistent naming convention for maintainability

### Customization
To adjust colors, modify the CSS variables in `:root`:
```css
:root {
    --parchment-dark: #2a2419;
    --text-primary: #e8dcc4;
    /* etc. */
}
```

## Medieval Theme Elements

1. **Parchment texture** - Subtle repeating gradient
2. **Ornate typography** - Cinzel font for headers
3. **Warm color palette** - Browns, golds, and ambers
4. **Aged appearance** - Darkened borders and shadows
5. **Classic serif fonts** - EB Garamond for readability

## Testing Recommendations

1. Test all form inputs for visibility
2. Verify focus states on all interactive elements
3. Check readability in different lighting conditions
4. Validate color contrast ratios
5. Test on mobile devices

---

**Created**: October 31, 2025
**Theme**: Dark Medieval Parchment
**Focus**: Readability & Atmosphere
