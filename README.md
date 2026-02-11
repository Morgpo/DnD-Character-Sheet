### Credits:
This original project was forked from [here](https://github.com/Chee32/5e-Character-Sheet) and was created by [@Chee32](https://github.com/Chee32) and [@lckynmbrsvn](https://github.com/lckynmbrsvn). 

**Version 2.0** - Completely rebuilt in React by [@Morgpo](https://github.com/Morgpo) to fix architectural issues and provide a more maintainable codebase.

---

# D&D 5e Character Sheet - React Edition

A modern, web-based character sheet for Dungeons & Dragons 5th Edition, built with **React** and **Vite**. This version provides a completely revamped architecture with reliable autosaving, proper state management, and a smooth user experience.

## ✨ What's New in Version 2.0

- **🔧 Built with React**: Modern component-based architecture
- **💾 Reliable Autosave**: Debounced autosaving that actually works consistently
- **⚔️ Working Add Attacks**: No more bugs when adding/removing attacks
- **📊 Single Source of Truth**: All data properly managed in React state
- **🎯 Auto-calculated Stats**: Modifiers, saves, skills, and spell DC automatically update
- **📱 Responsive Design**: Works great on desktop, tablet, and mobile
- **🎨 Preserved Aesthetic**: Same D&D parchment look you know and love

## 🚀 How to Use

### Option 1: Development Mode (Recommended for editing)
1. Clone or download the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to the URL shown (usually `http://localhost:3000`)

### Option 2: Build for Production
1. Install dependencies (if not already done):
   ```bash
   npm install
   ```
2. Build the app:
   ```bash
   npm run build
   ```
3. The built files will be in the `dist` folder
4. You can preview the build with:
   ```bash
   npm run preview
   ```
5. Or deploy the `dist` folder to any static hosting service

## 💾 Saving & Loading

- **Autosave**: Your changes are automatically saved to browser localStorage every second after you stop typing
- **Save Backup**: Download a JSON file of your character for safekeeping
- **Load Backup**: Upload a JSON file to restore a character
- **Clear Sheet**: Reset everything to create a new character

Your character data persists in your browser between sessions. For maximum safety, regularly use "Save Backup" to download JSON files.

## 🗂️ Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── Sidebar.jsx
│   │   ├── CharacterBasicInfo.jsx
│   │   ├── Attributes.jsx
│   │   ├── Status.jsx
│   │   ├── SavesAndSkills.jsx
│   │   ├── Proficiencies.jsx
│   │   ├── FeaturesTraits.jsx
│   │   ├── Charges.jsx
│   │   ├── Attacks.jsx
│   │   ├── Equipment.jsx
│   │   ├── Spells.jsx
│   │   ├── Backstory.jsx
│   │   └── Notes.jsx
│   ├── App.jsx              # Main app with state management
│   ├── App.css              # Component styles
│   ├── index.css            # Global styles
│   └── main.jsx             # React entry point
├── index.html               # HTML template
├── package.json             # Dependencies
└── vite.config.js           # Vite configuration
```

## 🎯 Features

- ✅ Character basic info (name, class, race, etc.)
- ✅ Ability scores with auto-calculated modifiers
- ✅ Saving throws with proficiency tracking
- ✅ Skills with proficiency and expertise
- ✅ HP, hit dice, death saves, and conditions
- ✅ Spellcasting with spell slots and prepared spells
- ✅ Attacks with auto-calculated to-hit/DC
- ✅ Class resources and item charges
- ✅ Equipment and inventory management
- ✅ Backstory, personality, and notes
- ✅ Responsive design for all devices

## 🔧 Technical Details

- **React 18**: Modern hooks-based components
- **Vite**: Lightning-fast build tool and dev server
- **CSS Variables**: Easy theming and customization
- **localStorage**: Persistent character data
- **Debounced Autosave**: Prevents performance issues

## 📝 License

Feel free to copy, modify, and use this project for your own D&D adventures (**ESPECIALLY HOMEBREWS!!!!**). Contributions and improvements are always welcome!
