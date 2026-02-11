import { useMemo, useEffect } from 'react'

const calculateMod = (score) => {
  const num = parseInt(score) || 10
  const mod = Math.floor((num - 10) / 2)
  return mod >= 0 ? `+${mod}` : `${mod}`
}

const calculateProficiency = (level) => {
  const lvl = parseInt(level) || 1
  return Math.ceil(lvl / 4) + 1
}

export default function Attributes({ attributes, topBar, basicInfo, onChange }) {
  const mods = useMemo(() => ({
    str: calculateMod(attributes.str),
    dex: calculateMod(attributes.dex),
    con: calculateMod(attributes.con),
    int: calculateMod(attributes.int),
    wis: calculateMod(attributes.wis),
    cha: calculateMod(attributes.cha)
  }), [attributes])

  // Auto-calculate proficiency from level
  const proficiency = useMemo(() => {
    return calculateProficiency(basicInfo.currentLevel)
  }, [basicInfo.currentLevel])

  // Update proficiency in topBar when level changes
  useEffect(() => {
    const profValue = `+${proficiency}`
    if (topBar.proficiency !== profValue) {
      onChange('topBar.proficiency', profValue)
    }
  }, [proficiency, topBar.proficiency, onChange])

  // Auto-calculate derived stats
  const initiative = useMemo(() => mods.dex, [mods.dex])
  const passivePerception = useMemo(() => {
    const wisBonus = parseInt(mods.wis) || 0
    return 10 + wisBonus
  }, [mods.wis])

  return (
    <>
      <section className="card">
        <h3 className="section-title">Core Statistics</h3>
        <div className="top-bar">
          <div className="stat-box">
            <input
              type="text"
              className="auto-filled"
              value={`+${proficiency}`}
              readOnly
              title="Automatically calculated from Current Level"
            />
            <label>Proficiency</label>
          </div>
          <div className="stat-box">
            <input
              type="text"
              className="auto-filled"
              value={initiative}
              readOnly
            />
            <label>Initiative</label>
          </div>
          <div className="stat-box">
            <input
              type="text"
              className="auto-filled"
              value={passivePerception}
              readOnly
            />
            <label>Passive Perception</label>
          </div>
          <div className="stat-box">
            <input
              type="text"
              value={topBar.ac}
              onChange={(e) => onChange('topBar.ac', e.target.value)}
            />
            <label>AC</label>
          </div>
          <div className="stat-box">
            <input
              type="text"
              value={topBar.speed}
              onChange={(e) => onChange('topBar.speed', e.target.value)}
            />
            <label>Speed</label>
          </div>
          <div className="stat-box">
            <input
              type="text"
              className="auto-filled"
              value={topBar.spellDC}
              readOnly
            />
            <label>Spell DC</label>
          </div>
          <div className="stat-box">
            <input
              type="text"
              value={topBar.inspiration}
              onChange={(e) => onChange('topBar.inspiration', e.target.value)}
            />
            <label>Inspiration</label>
          </div>
        </div>
      </section>

      <section className="card">
        <h3 className="section-title">Attributes</h3>
        <div className="attributes-grid">
          {['str', 'dex', 'con', 'int', 'wis', 'cha'].map(attr => (
            <div key={attr} className="attribute">
              <label>{attr.toUpperCase()}</label>
              <input
                type="text"
                maxLength="2"
                value={attributes[attr]}
                onChange={(e) => onChange(`attributes.${attr}`, e.target.value)}
              />
              <div className="attribute-mod auto-filled">{mods[attr]}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
