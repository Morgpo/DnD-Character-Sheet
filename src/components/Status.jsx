export default function Status({ data, onChange }) {
  const toggleDeathSave = (type, index) => {
    const current = data.deathSaves[type]
    const newValue = current === index + 1 ? 0 : index + 1
    onChange(`status.deathSaves.${type}`, newValue)
  }

  return (
    <section className="card">
      <h3 className="section-title">Status & Resources</h3>
      <div className="status-grid">
        <div className="hit-points">
          <div className="hp-group">
            <input
              type="text"
              value={data.tempHP}
              onChange={(e) => onChange('status.tempHP', e.target.value)}
            />
            <label>Temp HP</label>
          </div>
          <div className="hp-group">
            <input
              type="text"
              value={data.currentHP}
              onChange={(e) => onChange('status.currentHP', e.target.value)}
            />
            <label>Current HP</label>
          </div>
          <div className="hp-group">
            <input
              type="text"
              value={data.maxHP}
              onChange={(e) => onChange('status.maxHP', e.target.value)}
            />
            <label>Max HP</label>
          </div>
        </div>

        <div className="hit-dice">
          <label>Hit Dice</label>
          <div className="dice-input">
            <input
              type="text"
              value={data.hitDice}
              onChange={(e) => onChange('status.hitDice', e.target.value)}
            />
            <span>/</span>
            <input
              type="text"
              value={data.maxHitDice}
              onChange={(e) => onChange('status.maxHitDice', e.target.value)}
            />
          </div>
        </div>

        <div className="death-saves">
          <label>Death Saves</label>
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
          </div>
          <div className="saves-row">
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

        <div className="conditions">
          <label>Conditions</label>
          <textarea
            value={data.conditions}
            onChange={(e) => onChange('status.conditions', e.target.value)}
            rows="5"
            placeholder="Blinded, Charmed, etc."
          />
        </div>

        <div className="boons">
          <label>Boons</label>
          <textarea
            value={data.boons}
            onChange={(e) => onChange('status.boons', e.target.value)}
            rows="5"
            placeholder="Blessings, buffs, etc."
          />
        </div>
      </div>
    </section>
  )
}
