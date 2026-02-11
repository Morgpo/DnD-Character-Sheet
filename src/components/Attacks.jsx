import { useMemo } from 'react'

const calculateMod = (score) => {
  const num = parseInt(score) || 10
  return Math.floor((num - 10) / 2)
}

export default function Attacks({ attacks, attributes, proficiency, onChange }) {
  const prof = parseInt(proficiency) || 0

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
    const base = mods[attack.stat] || 0
    const total = base + prof
    return total >= 0 ? `+${total}` : `${total}`
  }

  const calculateSaveDC = (attack) => {
    if (attack.attackType === 'attack') return '--'
    const base = mods[attack.stat] || 0
    return 8 + base + prof
  }

  return (
    <section className="card attacks-section">
      <h3 className="section-title">Attacks</h3>
      <div className="attacks-container">
        <table className="attacks-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Stat</th>
              <th>Type</th>
              <th>To Hit / DC</th>
              <th>Damage</th>
              <th>Note</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {attacks.map((attack, index) => (
              <tr key={attack.id || index}>
                <td>
                  <input
                    type="text"
                    value={attack.name}
                    onChange={(e) => updateAttack(index, 'name', e.target.value)}
                    placeholder="Attack name"
                  />
                </td>
                <td>
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
                  </select>
                </td>
                <td>
                  <select
                    value={attack.attackType}
                    onChange={(e) => updateAttack(index, 'attackType', e.target.value)}
                  >
                    <option value="attack">Attack Roll</option>
                    <option value="save">Save DC</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    className="auto-filled"
                    value={attack.attackType === 'attack' ? calculateToHit(attack) : calculateSaveDC(attack)}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={attack.damage}
                    onChange={(e) => updateAttack(index, 'damage', e.target.value)}
                    placeholder="Damage"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={attack.notes || ''}
                    onChange={(e) => updateAttack(index, 'notes', e.target.value)}
                    placeholder="Notes"
                  />
                </td>
                <td>
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
