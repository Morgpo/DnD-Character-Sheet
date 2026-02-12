import { useMemo } from 'react'

const calculateMod = (score) => {
  const num = parseInt(score) || 10
  return Math.floor((num - 10) / 2)
}

export default function Attacks({ attacks, attributes, proficiency, spellCasting, onChange }) {
  const prof = parseInt(proficiency) || 0
  const spellAbility = spellCasting || 'none'

  const mods = useMemo(() => ({
    str: calculateMod(attributes.str),
    dex: calculateMod(attributes.dex),
    con: calculateMod(attributes.con),
    int: calculateMod(attributes.int),
    wis: calculateMod(attributes.wis),
    cha: calculateMod(attributes.cha)
  }), [attributes])

  const addAttack = () => {
    const newAttacks = [
      ...attacks,
      {
        id: Date.now(),
        name: '',
        stat: 'str',
        attackType: 'attack',
        damage: '',
        damageType: '',
        notes: ''
      }
    ]
    onChange('attacks', newAttacks)
  }

  const updateAttack = (index, field, value) => {
    const newAttacks = [...attacks]
    newAttacks[index] = { ...newAttacks[index], [field]: value }
    onChange('attacks', newAttacks)
  }

  const deleteAttack = (index) => {
    const newAttacks = attacks.filter((_, i) => i !== index)
    onChange('attacks', newAttacks)
  }

  const moveAttack = (index, direction) => {
    const newAttacks = [...attacks]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex >= 0 && newIndex < newAttacks.length) {
      [newAttacks[index], newAttacks[newIndex]] = [newAttacks[newIndex], newAttacks[index]]
      onChange('attacks', newAttacks)
    }
  }

  const calculateToHit = (attack) => {
    if (attack.attackType === 'save') return '--'
    if (attack.stat === 'custom') return attack.manualHit || ''
    const base = mods[attack.stat] || 0
    const total = base + prof
    return total >= 0 ? `+${total}` : `${total}`
  }

  const calculateSaveDC = (attack) => {
    if (attack.attackType === 'attack') return '--'
    if (attack.stat === 'custom') return attack.manualDC || ''
    if (spellAbility === 'none') return 'N/A'
    const base = mods[spellAbility] || 0
    return 8 + base + prof
  }

  return (
    <section className="card">
      <h3 className="section-title">Attacks</h3>
      <div className="attack-abilities-container">
        <table className="attack-abilities-table attacks">
          <thead>
            <tr>
              <th className="col-name">Name</th>
              <th className="col-stat">Stat</th>
              <th className="col-type">Roll / Save</th>
              <th className="col-dc">Hit / DC</th>
              <th className="col-damage">Damage</th>
              <th className="col-notes">Notes</th>
              <th className="col-controls"></th>
            </tr>
          </thead>
          <tbody>
            {attacks.map((attack, index) => (
              <tr key={attack.id || index}>
                <td className="col-name">
                  <input
                    type="text"
                    value={attack.name}
                    onChange={(e) => updateAttack(index, 'name', e.target.value)}
                    placeholder="Name"
                  />
                </td>
                <td className="col-stat">
                  <select
                    value={attack.stat}
                    onChange={(e) => updateAttack(index, 'stat', e.target.value)}
                  >
                    <option value="str">STR</option>
                    <option value="dex">DEX</option>
                    <option value="con">CON</option>
                    <option value="int">INT</option>
                    <option value="wis">WIS</option>
                    <option value="cha">CHA</option>
                    <option value="custom">CUSTOM</option>
                  </select>
                </td>
                <td className="col-type">
                  <select
                    value={attack.attackType}
                    onChange={(e) => updateAttack(index, 'attackType', e.target.value)}
                  >
                    <option value="attack">Attack Roll</option>
                    <option value="save">Save DC</option>
                  </select>
                </td>
                <td className="col-dc">
                  <input
                    type="text"
                    className={attack.stat === 'custom' ? '' : 'auto-filled'}
                    value={attack.attackType === 'attack' ? calculateToHit(attack) : calculateSaveDC(attack)}
                    onChange={(e) => {
                      if (attack.stat !== 'custom') return
                      const field = attack.attackType === 'attack' ? 'manualHit' : 'manualDC'
                      updateAttack(index, field, e.target.value)
                    }}
                    readOnly={attack.stat !== 'custom'}
                  />
                </td>
                <td className="col-damage">
                  <input
                    type="text"
                    value={attack.damage}
                    onChange={(e) => updateAttack(index, 'damage', e.target.value)}
                    placeholder="Damage"
                  />
                </td>
                <td className="col-notes">
                  <input
                    type="text"
                    value={attack.notes || ''}
                    onChange={(e) => updateAttack(index, 'notes', e.target.value)}
                    placeholder="Notes (e.g., Disadvantage on hit)"
                  />
                </td>
                <td className="col-controls">
                  <div className="action-buttons">
                    <button
                      className="move-btn"
                      onClick={() => moveAttack(index, 'up')}
                      disabled={index === 0}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      className="move-btn"
                      onClick={() => moveAttack(index, 'down')}
                      disabled={index === attacks.length - 1}
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteAttack(index)}
                      title="Delete attack"
                    >
                      ×
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="add-btn" onClick={addAttack}>
          + Add Attack
        </button>
      </div>
    </section>
  )
}
