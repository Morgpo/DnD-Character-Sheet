import { useMemo } from 'react'

const calculateMod = (score) => {
  const num = parseInt(score) || 10
  const mod = Math.floor((num - 10) / 2)
  return mod >= 0 ? `+${mod}` : `${mod}`
}

export default function Attributes({ attributes, basicInfo, onChange }) {
  const mods = useMemo(() => ({
    str: calculateMod(attributes.str),
    dex: calculateMod(attributes.dex),
    con: calculateMod(attributes.con),
    int: calculateMod(attributes.int),
    wis: calculateMod(attributes.wis),
    cha: calculateMod(attributes.cha)
  }), [attributes])

  return (
    <>
      <section className="card">
        <h3 className="section-title">Class & Background</h3>
        <div className="class-background-container">
          <div className="class-background-left">
            <div className="form-group">
              <label>Race/Species</label>
              <input
                type="text"
                value={basicInfo.race}
                onChange={(e) => onChange('basicInfo.race', e.target.value)}
                placeholder="Human, Gnome, Dwarf, etc."
              />
            </div>
            <div className="form-group">
              <label>Background</label>
              <input
                type="text"
                value={basicInfo.background}
                onChange={(e) => onChange('basicInfo.background', e.target.value)}
                placeholder="Soldier, Sage, Criminal, etc."
              />
            </div>
          </div>
          <div className="class-background-right">
            <label>Class Info</label>
            <textarea
              value={basicInfo.classes}
              onChange={(e) => onChange('basicInfo.classes', e.target.value)}
              placeholder="Gloom Stalker Ranger (5),

3 Sorcerer (Shadow Magic),

Warlock (Hexblade) (1), etc."
            />
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
