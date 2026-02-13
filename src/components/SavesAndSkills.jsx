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

  // Group skills by attribute
  const skillsByAttr = {
    str: ['athletics'],
    dex: ['acrobatics', 'sleightOfHand', 'stealth'],
    con: [],
    int: ['arcana', 'history', 'investigation', 'nature', 'religion'],
    wis: ['animalHandling', 'insight', 'medicine', 'perception', 'survival'],
    cha: ['deception', 'intimidation', 'performance', 'persuasion']
  }

  return (
    <section className="card">
      <h3 className="section-title">Saving Throws & Skills</h3>
      <div className="saves-skills-container">
        {['str', 'dex', 'con', 'int', 'wis', 'cha'].map(attr => (
          <div key={attr} className="stat-column">
            <div className="stat-header">{attr.toUpperCase()}</div>
            
            <div className="save-item">
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
              <label>Save</label>
            </div>

            <div className="skills-divider"></div>

            {skillsByAttr[attr].map(skillName => {
              const skill = skills[skillName]
              const profState = skill.expert ? 'expert' : (skill.prof ? 'prof' : 'none')
              
              const handleSkillClick = () => {
                if (skill.expert) {
                  // expert -> none
                  onChange(`skills.${skillName}.expert`, false)
                  onChange(`skills.${skillName}.prof`, false)
                } else if (skill.prof) {
                  // prof -> expert
                  onChange(`skills.${skillName}.expert`, true)
                } else {
                  // none -> prof
                  onChange(`skills.${skillName}.prof`, true)
                }
              }
              
              return (
                <div key={skillName} className="skill-item">
                  <div 
                    className={`skill-checkbox ${profState}`}
                    onClick={handleSkillClick}
                    title={profState === 'expert' ? 'Expertise' : profState === 'prof' ? 'Proficient' : 'Not Proficient'}
                  />
                  <input
                    type="text"
                    className="auto-filled"
                    value={calculateSkill(skillName)}
                    readOnly
                  />
                  <label>{SKILL_LABELS[skillName]}</label>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </section>
  )
}
