export default function Status({ data, spellSlots = {}, slotCounts = {}, onChange, onSlotToggle }) {
  const toggleDeathSave = (type, index) => {
    const current = data.deathSaves[type]
    const newValue = index === 0 && current > 0
      ? 0
      : current > index + 1
        ? index
        : current === index + 1
          ? 0
          : index + 1
    onChange(`status.deathSaves.${type}`, newValue)
  }

  const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  const getSlotsForLevel = (level) => {
    const existingSlots = Array.from(spellSlots?.[level] || [])
    const configuredCount = parseInt(slotCounts?.[level], 10)
    const targetLength = Math.max(existingSlots.length, Number.isFinite(configuredCount) ? configuredCount : 0)

    while (existingSlots.length < targetLength) {
      existingSlots.push(false)
    }

    return existingSlots
  }

  const hasSlots = levels.some((level) => getSlotsForLevel(level).length > 0)

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

        <div className="spell-slot-container">
          <label>Spell Slots</label>
          <div className="spell-slot-summary">
            {hasSlots ? (
              levels.map((level) => {
                const slots = getSlotsForLevel(level)
                if (!slots.length) return null

                return (
                  <div key={level} className="slot-level-row">
                    <span className="slot-level-label">Level {level}</span>
                    <div className="slot-checkboxes">
                      {slots.map((used, idx) => (
                        <input
                          key={idx}
                          type="checkbox"
                          checked={Boolean(used)}
                          onChange={() => onSlotToggle?.(level, idx)}
                          title="Toggle spell slot"
                        />
                      ))}
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="spell-slot-empty">Set slot counts on the Spells tab to track usage here.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
