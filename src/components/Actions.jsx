import { useMemo } from 'react'

const calculateMod = (score) => {
  const num = parseInt(score) || 10
  return Math.floor((num - 10) / 2)
}

export default function Actions({ actions, attributes, proficiency, onChange }) {
  const prof = parseInt(proficiency) || 0

  const mods = useMemo(() => ({
    str: calculateMod(attributes.str),
    dex: calculateMod(attributes.dex),
    con: calculateMod(attributes.con),
    int: calculateMod(attributes.int),
    wis: calculateMod(attributes.wis),
    cha: calculateMod(attributes.cha)
  }), [attributes])

  const addAction = () => {
    const newActions = [
      ...actions,
      {
        id: Date.now(),
        name: '',
        stat: 'wis',
        saveDC: '',
        description: ''
      }
    ]
    onChange('actions', newActions)
  }

  const updateAction = (index, field, value) => {
    const newActions = [...actions]
    newActions[index] = { ...newActions[index], [field]: value }
    onChange('actions', newActions)
  }

  const deleteAction = (index) => {
    const newActions = actions.filter((_, i) => i !== index)
    onChange('actions', newActions)
  }

  const moveAction = (index, direction) => {
    const newActions = [...actions]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex >= 0 && newIndex < newActions.length) {
      [newActions[index], newActions[newIndex]] = [newActions[newIndex], newActions[index]]
      onChange('actions', newActions)
    }
  }

  const calculateSaveDC = (action) => {
    const base = mods[action.stat] || 0
    return 8 + base + prof
  }

  return (
    <section className="card actions-section">
      <h3 className="section-title">Actions & Abilities</h3>
      <div className="actions-container">
        <table className="actions-table">
          <thead>
            <tr>
              <th>Ability Name</th>
              <th>Stat</th>
              <th>Save DC</th>
              <th>Description/Effect</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {actions.map((action, index) => (
              <tr key={action.id || index}>
                <td>
                  <input
                    type="text"
                    value={action.name}
                    onChange={(e) => updateAction(index, 'name', e.target.value)}
                    placeholder="Ability name"
                  />
                </td>
                <td>
                  <select
                    value={action.stat}
                    onChange={(e) => updateAction(index, 'stat', e.target.value)}
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
                  <input
                    type="text"
                    className="auto-filled"
                    value={calculateSaveDC(action)}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={action.description}
                    onChange={(e) => updateAction(index, 'description', e.target.value)}
                    placeholder="Effect (e.g., Paralyze on fail)"
                  />
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="move-btn"
                      onClick={() => moveAction(index, 'up')}
                      disabled={index === 0}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      className="move-btn"
                      onClick={() => moveAction(index, 'down')}
                      disabled={index === actions.length - 1}
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteAction(index)}
                      title="Delete action"
                    >
                      ×
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="add-btn" onClick={addAction}>
          + Add Action/Ability
        </button>
      </div>
    </section>
  )
}
