# DnD Character Sheet TODO List





## Easy/High Priority

- [ ] think

--- 
---

## Brainstorming/Low Priority

- [ ] Refactor entire "page" concept to be more modular
        - Either have a single page with collapsible sections , or have multiple pages - but have it be coherent and make sense gameplay-wise
        - Like maybe "Overview" page with basic info that you fill out and just have a very general look at your character, and then have separate pages for "Combat" (attacks, HP, conditions), "Attributes" (Modifiers, Saves, stuff for out of combat but where you need your sheet), "Inventory" (equipment and resources), and "Backstory" (personality, backstory, notes)
                - Overview
                        - Overview kind of just has everything but in a very condensed form, so you can just look at it and get a general idea of your character. Maybe have the ability to customize what sections show up on the overview page?
                - Combat
                - Attributes
                - Inventory
                - Backstory
        - And some pages can have overlapping info, which might be an issue, but it would be amazing for usability to have a more modular design where you can just focus on the info you need at the moment instead of having to scroll through everything or tab to the wrong page to find the info you need

- [ ] Add Wiki Links to Everything
    - Maybe try to implement a way to have no input for the wiki link specifically, but based on the user's input for name try to create the wikidot link from that.
        - Like obviously we won't be able to make a wikidot link from "Longsword", but we could do it from like spell names and classes.
    - Have a small text input for a wiki link in the following sections:
        - Attacks
        - Actions
        - Resources/Charges
        - Spells
        - Class
        - Race
    - Come up with a middle ground for these. Some like Class and Species we can definitely generate (and even if it's not a real link they'll be using a), but for sure some will need a link input.

- [ ] Actual notetaking app too?
    - Like make an actual good notetaking app within the character sheet

---

## Done

- [x] Refactor UI theme to be more visually appealing ✅
        - Dark medieval fantasy style
        - Unique but readable fonts
        - Better color scheme for readability

- [x] Fix Death Saves UI ✅
        - Previously overlapping Hit Dice - now fixed with proper grid layout

- [x] Add Current Level Input ✅
        - Automatically calculate proficiency bonus based on level
        - New numeric input field (1-20) in character header

- [x] Rename "Top Bar" to something more thematically appropriate ✅
        - Renamed to "Core Statistics"

- [x] Clear Sheet functionality ✅
        - Now properly clears all data and resets to blank state

- [x] Document explaining what all should be implemented and what is not yet ✅
        - See FEATURES.md for comprehensive implementation status

- [x] Change the Locked elements color to something more thematic - maybe a gold outline and like greyed out. The blue is a bit too off theme.

- [x] Maybe make the checkboxes darker, or make the rest of the theme slightly lighter to make the checkboxes pop less

- [x] Remove placeholder text from all inputs that are centered (mostly numbers, the placeholder text overlaps with the text cursor and looks weird)

- [x] Make "Actions" tab
    - This is basically a copy of the attacks section, but for spells or abilities that don't do damage but involve other stats (hold person, command, etc.)

- [x] Add arrows to move entries in the Items, Resources, and the new Actions sections up and down to reorder them

- [x] Make the loced text not italics, that font is hard to read like that

- [x] Change Damage placeholder text to something else, "1d8+3" makes me think I put that value in

- [x] Remove the default up arrows in the number text boxes. Have them match text text boxes and just have nothing
    - Weight, Current Level, Spell Slots counter

    - [x] Format Actions and Spells
    - Copy the spacing and formatting from the attacks section.
        - This was modified to be more general and less confusing, last time just the subtext was removed and no other changes

- [x] Refactor the Spell slots counter, but it right underneath the Level, and have the checkboxes appear one by one extending left, with some extra padding between the counter and the checkboxes. Also have the checkboxes on the same verticality as the counter, which is right under the level, so it looks more cohesive and less like the checkboxes are just floating in the middle of the page

- [x] Add a textbox for notes on the attack entries. Make the Hit/DC column a little smaller and put the notes on the far right. Also change the "Type" text to "Note" and just align that over the textbox

- [x] Spells (and cantrips of course)
    - Add padding between the Spell slot counter and the first spell
    - Add up/down arrows to spells to reorder them
    - For some reason the Spell slot text input deselects when you start typing, must fix that
    - Have two text inputs, one for the text name, another for the wiki link. Optional: have a button that you can click to go to the link, which only appears if there is a link. Also, make the link and button right aligned with the button on the far left of that align but keep the Spell name input big and left aligned, so it looks more cohesive and less like the link input is just floating in the middle of the page or just a whole page for one input that's three words long

- [x] Match the size of the inputs in the Actions section to the ones in the Attacks section. Then make the Description/Notes input in the abilities section fill out the rest of the row