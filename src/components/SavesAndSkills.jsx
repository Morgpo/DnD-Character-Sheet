import { useMemo } from 'react'

const calculateMod = (score) => {
  const num = parseInt(score) || 10
  return Math.floor((num - 10) / 2)
}

const SKILL_MAPPING = {
  athletics: 'str',
  acrobatics: 'dex',
  sleightOfHand: 'dex',
  stealth: 'dex',
  arcana: 'int',
  history: 'int',
  investigation: 'int',
  nature: 'int',
  religion: 'int',
  animalHandling: 'wis',
  insight: 'wis',
  medicine: 'wis',
  perception: 'wis',
  survival: 'wis',
  deception: 'cha',
  intimidation: 'cha',
  performance: 'cha',
  persuasion: 'cha'
}

const SKILL_LABELS = {
  athletics: 'Athletics',
  acrobatics: 'Acrobatics',
  sleightOfHand: 'Sleight of Hand',
  stealth: 'Stealth',
  arcana: 'Arcana',
  history: 'History',
  investigation: 'Investigation',
  nature: 'Nature',
  religion: 'Religion',
  animalHandling: 'Animal Handling',
  insight: 'Insight',
  medicine: 'Medicine',
  perception: 'Perception',
  survival: 'Survival',
  deception: 'Deception',
  intimidation: 'Intimidation',
  performance: 'Performance',
  persuasion: 'Persuasion'
}

export default function SavesAndSkills({ 
  attributes, 
  topBar, 
  saves, 
  skills, 
  spellCasting, 
  onChange 
}) {
  const prof = parseInt(topBar.proficiency) || 0

  const mods = useMemo(() => ({
    str: calculateMod(attributes.str),
    dex: calculateMod(attributes.dex),
    con: calculateMod(attributes.con),
    int: calculateMod(attributes.int),
    wis: calculateMod(attributes.wis),
    cha: calculateMod(attributes.cha)
  }), [attributes])

  const calculateSave = (attr) => {
    const base = mods[attr]
    const bonus = saves[attr] ? prof : 0
    const total = base + bonus
    return total >= 0 ? `+${total}` : `${total}`
  }

  const calculateSkill = (skillName) => {
    const attr = SKILL_MAPPING[skillName]
    const base = mods[attr]
    const skill = skills[skillName]
    let bonus = 0
    if (skill.expert) bonus = prof * 2
    else if (skill.prof) bonus = prof
    const total = base + bonus
    return total >= 0 ? `+${total}` : `${total}`
  }

  const calculateSpellDC = () => {
    if (spellCasting === 'none') return 'N/A'
    const base = mods[spellCasting] || 0
    return 8 + base + prof
  }

  const calculateSpellBonus = () => {
    if (spellCasting === 'none') return 'N/A'
    const base = mods[spellCasting] || 0
    const total = base + prof
    return total >= 0 ? `+${total}` : `${total}`
  }

  // Auto-update spell DC
  useMemo(() => {
    const dc = calculateSpellDC()
    if (dc !== topBar.spellDC) {
      onChange('topBar.spellDC', dc)
    }
  }, [spellCasting, mods, prof])

  return (
    <section className="card">
      <h3 className="section-title">Saving Throws & Skills</h3>
      <div className="saves-skills-container">
        <div className="saves-section">
          <h4>Saving Throws</h4>
          {['str', 'dex', 'con', 'int', 'wis', 'cha'].map(attr => (
            <div key={attr} className="save-item">
              <input
                type="checkbox"
                checked={saves[attr]}
                onChange={(e) => onChange(`saves.${attr}`, e.target.checked)}
              />
              <input
                type="text"
                className="auto-filled"
                value={calculateSave(attr)}
                readOnly
              />
              <label>{attr.toUpperCase()}</label>
            </div>
          ))}
        </div>

        <div className="skills-section">
          <h4>Skills</h4>
          {Object.keys(SKILL_MAPPING).map(skillName => (
            <div key={skillName} className="skill-item">
              <input
                type="checkbox"
                checked={skills[skillName].prof}
                onChange={(e) => onChange(`skills.${skillName}.prof`, e.target.checked)}
              />
              <input
                type="checkbox"
                checked={skills[skillName].expert}
                onChange={(e) => onChange(`skills.${skillName}.expert`, e.target.checked)}
                title="Expertise"
              />
              <input
                type="text"
                className="auto-filled"
                value={calculateSkill(skillName)}
                readOnly
              />
              <label>{SKILL_LABELS[skillName]}</label>
              <span className="skill-attr">({SKILL_MAPPING[skillName].toUpperCase()})</span>
            </div>
          ))}
        </div>

        <div className="spellcasting-section">
          <h4>Spellcasting</h4>
          <div className="spell-select">
            <label>Ability</label>
            <select
              value={spellCasting}
              onChange={(e) => onChange('spellCasting', e.target.value)}
            >
              <option value="none">No Spellcasting</option>
              <option value="str">Strength</option>
              <option value="dex">Dexterity</option>
              <option value="con">Constitution</option>
              <option value="int">Intelligence</option>
              <option value="wis">Wisdom</option>
              <option value="cha">Charisma</option>
            </select>
          </div>
          <div className="spell-stats">
            <div className="spell-stat">
              <label>Spell DC</label>
              <input
                type="text"
                className="auto-filled"
                value={calculateSpellDC()}
                readOnly
              />
            </div>
            <div className="spell-stat">
              <label>Spell Attack</label>
              <input
                type="text"
                className="auto-filled"
                value={calculateSpellBonus()}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
