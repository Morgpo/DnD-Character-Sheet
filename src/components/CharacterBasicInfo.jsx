function StatBox({ label, value, onChange: onStatChange, readOnly }) {
  return (
    <div className="stat-box-header">
      <input
        type="text"
        value={value}
        onChange={readOnly ? undefined : (e) => onStatChange(e.target.value)}
        placeholder={label}
        readOnly={readOnly}
        className={readOnly ? "auto-filled" : ""}
      />
      <label>{label}</label>
    </div>
  )
}

function HPBox({ label, value, onChange: onStatChange }) {
  return (
    <div className="hp-box-header">
      <input
        type="number"
        value={value}
        onChange={(e) => onStatChange(e.target.value)}
      />
      <label>{label}</label>
    </div>
  )
}

import { useEffect } from 'react'

export default function CharacterBasicInfo({ data, topBar, status, attributes, onChange }) {
  // Calculate proficiency from level
  const calculateProficiency = (level) => {
    const lvl = parseInt(level) || 1
    return Math.ceil(lvl / 4) + 1
  }

  // Calculate modifier from attribute score
  const calculateMod = (score) => {
    const num = parseInt(score) || 10
    const mod = Math.floor((num - 10) / 2)
    return mod >= 0 ? `+${mod}` : `${mod}`
  }

  const proficiencyBonus = calculateProficiency(data.currentLevel)
  const proficiency = `+${proficiencyBonus}`
  const initiative = calculateMod(attributes?.dex || 10)
  const passivePerception = 10 + (parseInt(calculateMod(attributes?.wis || 10)) || 0)

  // Auto-update topBar.proficiency when level changes
  useEffect(() => {
    const profValue = proficiencyBonus.toString()
    if (topBar.proficiency !== profValue) {
      onChange('topBar.proficiency', profValue)
    }
  }, [data.currentLevel])

  return (
    <header className="character-header-banner">
      <div className="character-name-section">
        <input
          type="text"
          value={data.charName}
          onChange={(e) => onChange('basicInfo.charName', e.target.value)}
          placeholder="Character Name"
          className="character-name-input"
        />
      </div>

      <div className="header-stats-row">
        <StatBox
          label="Level"
          value={data.currentLevel}
          onChange={(val) => onChange('basicInfo.currentLevel', val)}
        />
        <StatBox
          label="Experience"
          value={data.exp}
          onChange={(val) => onChange('basicInfo.exp', val)}
        />
        <StatBox
          label="Inspiration"
          value={topBar.inspiration}
          onChange={(val) => onChange('topBar.inspiration', val)}
        />
      </div>

      <div className="header-stats-row">
        <StatBox
          label="AC"
          value={topBar.ac}
          onChange={(val) => onChange('topBar.ac', val)}
        />
        <div className="hp-group-header">
          <label>Hit Points</label>
          <div className="hp-inputs">
            <HPBox
              label="Temp"
              value={status.tempHP}
              onChange={(val) => onChange('status.tempHP', val)}
            />
            <HPBox
              label="Current"
              value={status.currentHP}
              onChange={(val) => onChange('status.currentHP', val)}
            />
            <HPBox
              label="Max"
              value={status.maxHP}
              onChange={(val) => onChange('status.maxHP', val)}
            />
          </div>
        </div>
        <StatBox
          label="Speed"
          value={topBar.speed}
          onChange={(val) => onChange('topBar.speed', val)}
        />
        <StatBox
          label="Size"
          value={data.size}
          onChange={(val) => onChange('basicInfo.size', val)}
        />
      </div>

      <div className="header-stats-row">
        <StatBox
          label="Proficiency"
          value={proficiency}
          readOnly={true}
        />
        <StatBox
          label="Initiative"
          value={topBar.initiative}
          onChange={(val) => onChange('topBar.initiative', val)}
        />
        <StatBox
          label="Passive Perception"
          value={passivePerception}
          readOnly={true}
        />
      </div>
    </header>
  )
}
