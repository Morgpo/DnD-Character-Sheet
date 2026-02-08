### Credits:
This project was forked from [here](https://github.com/Chee32/5e-Character-Sheet) and has been modified to include additional features and improvements. The original project was created by [@Chee32](https://github.com/Chee32), and some other enhancements were made by [@lckynmbrsvn](https://github.com/lckynmbrsvn).

---

# D&D 5e Character Sheet
A web-based character sheet for Dungeons & Dragons 5th Edition, built with HTML, CSS, and JavaScript. This project allows players to create and manage their characters digitally, providing an interactive and user-friendly interface.

#### *Please feel free to copy, modify, and use this project for your own D&D adventures (ESPECIALLY HOMEBREWS!!!!). Contributions and improvements are always welcome!*

## How to Use:
1. Clone or download the repository to your local machine.
2. Open the `index.html` file in your web browser.
3. Play D&D with your digital character sheet!

## Notes on Saving:
- This character **autosaves** to your browser's local storage, so if you are using the same browser and device, **your character will be saved between sessions**. However, if you clear your browser's cache or use a different device, your character data will not be available. You will need to export you character sheet to switch devices or to save a backup.
- To export your character sheet, click the "Download Backup" button, which will download a JSON file containing your character's data. You then need to replace the existing `savedSheet.json` file in the project directory with your exported file and click the "Reload Sheet" button to load your character data into the application. That's it! Now, your character sheet will go back to automatically saving your character sheet.
    - You can also use this fearure to have multiple character sheets by exporting and importing different JSON files, just make sure to replace the `savedSheet.json` file with the one you want to load before clicking the "Reload Sheet"*button.
