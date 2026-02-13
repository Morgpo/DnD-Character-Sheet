import { useMemo } from 'react'

const calculateMod = (score) => {
  const num = parseInt(score) || 10
  const mod = Math.floor((num - 10) / 2)
  return mod >= 0 ? `+${mod}` : `${mod}`
}

export default function Attributes({ attributes, onChange }) {
  const mods = useMemo(() => ({
    str: calculateMod(attributes.str),
    dex: calculateMod(attributes.dex),
    con: calculateMod(attributes.con),
    int: calculateMod(attributes.int),
    wis: calculateMod(attributes.wis),
    cha: calculateMod(attributes.cha)
  }), [attributes])

  return (
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
  )
}
