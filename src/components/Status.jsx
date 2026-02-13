export default function Status({ data, onChange }) {
  const toggleDeathSave = (type, index) => {
    const current = data.deathSaves[type]
    const newValue = current === index + 1 ? 0 : index + 1
    onChange(`status.deathSaves.${type}`, newValue)
  }

  return (
    <section className="card">
      <h3 className="section-title">Status & Conditions</h3>
      <div className="status-grid">
        <div className="hit-dice">
          <label>Hit Dice</label>
          <div className="hit-dice-inputs">
            <div className="hit-dice-item">
              <input
                type="text"
                value={data.hitDice}
                onChange={(e) => onChange('status.hitDice', e.target.value)}
              />
              <span>Current</span>
            </div>
            <div className="hit-dice-item">
              <input
                type="text"
                value={data.maxHitDice}
                onChange={(e) => onChange('status.maxHitDice', e.target.value)}
              />
              <span>Max</span>
            </div>
          </div>
        </div>

        <div className="death-saves">
          <label>Death Saves</label>
          <div className="death-saves-content">
            <div className="saves-row">
              <span>Success</span>
              <div className="checkboxes">
                {[0, 1, 2].map(i => (
                  <input
                    key={i}
                    type="checkbox"
                    checked={data.deathSaves.successes > i}
                    onChange={() => toggleDeathSave('successes', i)}
                  />
                ))}
              </div>
              <span>Failure</span>
              <div className="checkboxes">
                {[0, 1, 2].map(i => (
                  <input
                    key={i}
                    type="checkbox"
                    checked={data.deathSaves.failures > i}
                    onChange={() => toggleDeathSave('failures', i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="conditions">
          <label>Conditions</label>
          <textarea
            value={data.conditions}
            onChange={(e) => onChange('status.conditions', e.target.value)}
            rows="4"
            placeholder="Blinded, Charmed, etc."
          />
        </div>

        <div className="boons">
          <label>Boons</label>
          <textarea
            value={data.boons}
            onChange={(e) => onChange('status.boons', e.target.value)}
            rows="4"
            placeholder="Blessings, buffs, etc."
          />
        </div>
      </div>
    </section>
  )
}
