export default function Charges({ charges, onChange }) {
  const addCharge = () => {
    const newCharges = [
      ...charges,
      {
        id: Date.now(),
        name: '',
        max: 0,
        current: 0,
        notes: ''
      }
    ]
    onChange('charges', newCharges)
  }

  const updateCharge = (index, field, value) => {
    const newCharges = [...charges]
    newCharges[index] = { ...newCharges[index], [field]: value }
    onChange('charges', newCharges)
  }

  const deleteCharge = (index) => {
    const newCharges = charges.filter((_, i) => i !== index)
    onChange('charges', newCharges)
  }

  const moveCharge = (index, direction) => {
    const newCharges = [...charges]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex >= 0 && newIndex < newCharges.length) {
      [newCharges[index], newCharges[newIndex]] = [newCharges[newIndex], newCharges[index]]
      onChange('charges', newCharges)
    }
  }

  const toggleBox = (chargeIndex, boxIndex) => {
    const charge = charges[chargeIndex]
    const newCurrent = charge.current === boxIndex + 1 ? boxIndex : boxIndex + 1
    updateCharge(chargeIndex, 'current', newCurrent)
  }

  return (
    <section className="card">
      <h3 className="section-title">Resources & Charges</h3>
      <div className="attack-abilities-container">
        <table className="attack-abilities-table charges">
          <thead>
            <tr>
              <th className="col-name">Name</th>
              <th className="col-number">Max</th>
              <th className="col-charges">Charges</th>
              <th className="col-notes">Notes</th>
              <th className="col-controls"></th>
            </tr>
          </thead>
          <tbody>
            {charges.map((charge, chargeIndex) => (
              <tr key={charge.id || chargeIndex}>
                <td className="col-name">
                  <input
                    type="text"
                    value={charge.name}
                    onChange={(e) => updateCharge(chargeIndex, 'name', e.target.value)}
                    placeholder="Name"
                  />
                </td>
                <td className="col-number">
                  <input
                    type="number"
                    value={charge.max || ''}
                    onChange={(e) => {
                      const parsed = parseInt(e.target.value)
                      const clamped = Math.min(50, Math.max(0, isNaN(parsed) ? 0 : parsed))
                      updateCharge(chargeIndex, 'max', clamped)
                    }}
                    placeholder="Max"
                    min="0"
                    max="50"
                  />
                </td>
                <td>
                  <div className="charge-boxes">
                    {Array.from({ length: Math.min(parseInt(charge.max) || 0, 50) }).map((_, boxIndex) => (
                      <input
                        key={boxIndex}
                        type="checkbox"
                        checked={boxIndex < charge.current}
                        onChange={() => toggleBox(chargeIndex, boxIndex)}
                      />
                    ))}
                  </div>
                </td>
                <td className="col-notes">
                  <input
                    type="text"
                    value={charge.notes || ''}
                    onChange={(e) => updateCharge(chargeIndex, 'notes', e.target.value)}
                    placeholder="Notes (e.g., Regain max on long rest)"
                  />
                </td>
                <td className="col-controls">
                  <div className="action-buttons">
                    <button
                      className="move-btn"
                      onClick={() => moveCharge(chargeIndex, 'up')}
                      disabled={chargeIndex === 0}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      className="move-btn"
                      onClick={() => moveCharge(chargeIndex, 'down')}
                      disabled={chargeIndex === charges.length - 1}
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteCharge(chargeIndex)}
                      title="Delete"
                    >
                      ×
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="add-btn" onClick={addCharge}>
          + Add Resource
        </button>
      </div>
    </section>
  )
}
