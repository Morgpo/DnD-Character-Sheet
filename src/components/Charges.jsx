export default function Charges({ charges, onChange }) {
  const addCharge = () => {
    const newCharges = [
      ...charges,
      {
        id: Date.now(),
        name: '',
        max: 0,
        current: 0
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
      <h2>Resources & Charges</h2>
      <div className="charges-container">
        {charges.map((charge, chargeIndex) => (
          <div key={charge.id || chargeIndex} className="charge-row">
            <div className="charge-controls">
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
            <input
              type="text"
              className="charge-name"
              value={charge.name}
              onChange={(e) => updateCharge(chargeIndex, 'name', e.target.value)}
              placeholder="Resource name (e.g., Ki Points, Rage)"
            />
            <input
              type="number"
              className="charge-max"
              value={charge.max}
              onChange={(e) => updateCharge(chargeIndex, 'max', parseInt(e.target.value) || 0)}
              placeholder="Max"
              min="0"
            />
            <div className="charge-boxes">
              {Array.from({ length: Math.min(parseInt(charge.max) || 0, 20) }).map((_, boxIndex) => (
                <input
                  key={boxIndex}
                  type="checkbox"
                  checked={boxIndex < charge.current}
                  onChange={() => toggleBox(chargeIndex, boxIndex)}
                />
              ))}
            </div>
          </div>
        ))}
        <button className="add-btn" onClick={addCharge}>
          + Add Resource
        </button>
      </div>
    </section>
  )
}
