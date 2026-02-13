export default function Equipment({ data, onChange }) {
  const normalizeWeightInput = (value) => {
    if (value === '') {
      return ''
    }

    const parsed = parseFloat(value)
    return Number.isNaN(parsed) ? '' : parsed
  }

  const addItem = () => {
    const newItems = [
      ...data.items,
      {
        id: Date.now(),
        name: '',
        weight: ''
      }
    ]
    onChange('equipment.items', newItems)
  }

  const updateItem = (index, field, value) => {
    const newItems = [...data.items]
    newItems[index] = { ...newItems[index], [field]: value }
    onChange('equipment.items', newItems)
  }

  const deleteItem = (index) => {
    const newItems = data.items.filter((_, i) => i !== index)
    onChange('equipment.items', newItems)
  }

  const moveItem = (index, direction) => {
    const newItems = [...data.items]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex >= 0 && newIndex < newItems.length) {
      [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]]
      onChange('equipment.items', newItems)
    }
  }

  const totalWeight = data.items.reduce((sum, item) => {
    return sum + (parseFloat(item.weight) || 0)
  }, 0)

  return (
    <section className="card">
      <h3 className="section-title">Inventory</h3>
      <div className="equipment-container">
        <div className="currency-section">
          <h4>Currency</h4>
          <div className="currency-grid">
            {[
              { key: 'cp', label: 'CP' },
              { key: 'sp', label: 'SP' },
              { key: 'ep', label: 'EP' },
              { key: 'gp', label: 'GP' },
              { key: 'pp', label: 'PP' }
            ].map(coin => (
              <div key={coin.key} className="currency-item">
                <label>{coin.label}</label>
                <input
                  type="text"
                  value={data.currency[coin.key]}
                  onChange={(e) => onChange(`equipment.currency.${coin.key}`, e.target.value)}
                  placeholder="0"
                />
              </div>
            ))}
          </div>

          <div className="encumbrance">
            <div className="encumbrance-item">
              <label>Carrying Capacity</label>
              <input
                type="text"
                value={data.capacity}
                onChange={(e) => onChange('equipment.capacity', e.target.value)}
                placeholder="150"
              />
            </div>
            <div className="encumbrance-item">
              <label>Current Weight</label>
              <input
                type="text"
                className="auto-filled"
                value={totalWeight.toFixed(1)}
                readOnly
              />
            </div>
            <div className="encumbrance-item">
              <label>Encumbrance</label>
              <input
                type="text"
                value={data.encumbrance}
                onChange={(e) => onChange('equipment.encumbrance', e.target.value)}
                placeholder="Normal"
              />
            </div>
          </div>
        </div>

        <div className="items-section">
          <h4>Items</h4>
          <table className="items-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Weight (lb)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={item.id || index}>
                  <td>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(index, 'name', e.target.value)}
                      placeholder="Item name"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.weight}
                      onChange={(e) => updateItem(index, 'weight', normalizeWeightInput(e.target.value))}
                      placeholder="0"
                    />
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="move-btn"
                        onClick={() => moveItem(index, 'up')}
                        disabled={index === 0}
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        className="move-btn"
                        onClick={() => moveItem(index, 'down')}
                        disabled={index === data.items.length - 1}
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteItem(index)}
                        title="Delete item"
                      >
                        ×
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="add-btn" onClick={addItem}>
            + Add Item
          </button>
        </div>
      </div>
    </section>
  )
}
