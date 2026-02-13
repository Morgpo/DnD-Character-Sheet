const SpellLevel = ({ level, levelName, spells, onChange, addSpell, updateSpell, deleteSpell, moveSpell, toggleSlot, updateSlotCount }) => {
    const key = level === 0 ? 'cantrips' : `level${level}`
    const levelSpells = spells[key] || []
    const slots = spells.slots[level] || []

    return (
      <div className="spell-level">
        <div className="spell-level-header">
          <h4>{levelName}</h4>
        </div>
        {level > 0 && (
          <div className="spell-slots">
            <div className="spell-slots-input">
              <label>Slots:</label>
              <input
                key={`slot-count-${level}`}
                placeholder="0"
                type="number"
                min="0"
                value={slots.length || ''}
                onChange={(e) => updateSlotCount(level, e.target.value)}
                className="slot-count"
              />
            </div>
          <div className="slot-checkboxes">
              {slots.map((used, idx) => (
                <input
                  key={idx}
                  type="checkbox"
                  checked={used}
                  onChange={() => toggleSlot(level, idx)}
                />
              ))}
            </div>
          </div>
        )}
        <div className="spells-list">
          {levelSpells.map((spell, index) => (
            <div key={spell.id || index} className="spell-item">
              <div className="spell-controls">
                {level > 0 && (
                  <input
                    type="checkbox"
                    checked={spell.prepared}
                    onChange={(e) => updateSpell(level, index, 'prepared', e.target.checked)}
                    title="Prepared"
                  />
                )}
              </div>
              <input
                type="text"
                value={spell.name}
                onChange={(e) => updateSpell(level, index, 'name', e.target.value)}
                placeholder="Spell name"
                className="spell-name"
              />
              <div className="spell-link-group">
                <input
                  type="text"
                  value={spell.link || ''}
                  onChange={(e) => updateSpell(level, index, 'link', e.target.value)}
                  placeholder="Wiki link (optional)"
                  className="spell-link"
                />
                <button
                  className="link-btn"
                  onClick={() => spell.link && window.open(spell.link, '_blank', 'noopener,noreferrer')}
                  disabled={!spell.link}
                  title={spell.link ? "Open link" : "No link provided"}
                >
                  🔗
                </button>
              </div>
              <button
                  className="move-btn"
                  onClick={() => moveSpell(level, index, 'up')}
                  disabled={index === 0}
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  className="move-btn"
                  onClick={() => moveSpell(level, index, 'down')}
                  disabled={index === levelSpells.length - 1}
                  title="Move down"
                >
                  ↓
                </button>
              <button
                className="delete-btn"
                onClick={() => deleteSpell(level, index)}
                title="Delete spell"
              >
                ×
              </button>
            </div>
          ))}
          <button className="add-btn-small" onClick={() => addSpell(level)}>
            + Add {levelName} Spell
          </button>
        </div>
      </div>
    )
  }

export default function Spells({ spells, attributes, proficiency, spellCasting, onChange }) {
  const calculateMod = (score) => {
    const num = parseInt(score) || 10
    return Math.floor((num - 10) / 2)
  }

  const calculateSpellDC = () => {
    if (spellCasting === 'none') return 'N/A'
    const mods = {
      str: calculateMod(attributes.str),
      dex: calculateMod(attributes.dex),
      con: calculateMod(attributes.con),
      int: calculateMod(attributes.int),
      wis: calculateMod(attributes.wis),
      cha: calculateMod(attributes.cha)
    }
    const base = mods[spellCasting] || 0
    const prof = parseInt(proficiency) || 0
    return 8 + base + prof
  }

  const calculateSpellBonus = () => {
    if (spellCasting === 'none') return 'N/A'
    const mods = {
      str: calculateMod(attributes.str),
      dex: calculateMod(attributes.dex),
      con: calculateMod(attributes.con),
      int: calculateMod(attributes.int),
      wis: calculateMod(attributes.wis),
      cha: calculateMod(attributes.cha)
    }
    const base = mods[spellCasting] || 0
    const prof = parseInt(proficiency) || 0
    const total = base + prof
    return total >= 0 ? `+${total}` : `${total}`
  }

  const addSpell = (level) => {
    const key = level === 0 ? 'cantrips' : `level${level}`
    const newSpells = [
      ...spells[key],
      {
        id: Date.now(),
        name: '',
        link: '',
        prepared: false
      }
    ]
    onChange(`spells.${key}`, newSpells)
  }

  const updateSpell = (level, index, field, value) => {
    const key = level === 0 ? 'cantrips' : `level${level}`
    const newSpells = [...spells[key]]
    newSpells[index] = { ...newSpells[index], [field]: value }
    onChange(`spells.${key}`, newSpells)
  }

  const deleteSpell = (level, index) => {
    const key = level === 0 ? 'cantrips' : `level${level}`
    const newSpells = spells[key].filter((_, i) => i !== index)
    onChange(`spells.${key}`, newSpells)
  }

  const moveSpell = (level, index, direction) => {
    const key = level === 0 ? 'cantrips' : `level${level}`
    const newSpells = [...spells[key]]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex >= 0 && newIndex < newSpells.length) {
      [newSpells[index], newSpells[newIndex]] = [newSpells[newIndex], newSpells[index]]
      onChange(`spells.${key}`, newSpells)
    }
  }

  const toggleSlot = (level, index) => {
    const newSlots = [...(spells.slots[level] || [])]
    newSlots[index] = !newSlots[index]
    onChange(`spells.slots.${level}`, newSlots)
  }

  const updateSlotCount = (level, count) => {
    const numSlots = Math.max(0, Math.min(82, parseInt(count) || 0))
    const newSlots = Array(numSlots).fill(false)
    onChange(`spells.slots.${level}`, newSlots)
  }

  return (
    <>
      <section className="card">
        <h3 className="section-title">Spell Info</h3>
        <div className="spell-info-grid">
          <div className="info-group">
            <label>Spellcasting Ability</label>
            <select
              value={spellCasting}
              onChange={(e) => onChange('spellCasting', e.target.value)}
            >
              <option value="none">No Spellcasting</option>
              <option value="str">Strength</option>
              <option value="dex">Dexterity</option>
              <option value="con">Constitution</option>
              <option value="int">Intelligence</option>
              <option value="wis">Wisdom</option>
              <option value="cha">Charisma</option>
            </select>
          </div>
          <div className="info-group">
            <label>Spell DC</label>
            <input
              type="text"
              className="auto-filled"
              value={calculateSpellDC()}
              readOnly
            />
          </div>
          <div className="info-group">
            <label>Spell Attack</label>
            <input
              type="text"
              className="auto-filled"
              value={calculateSpellBonus()}
              readOnly
            />
          </div>
          <div className="info-group">
            <label>Spellcasting Class</label>
            <input
              type="text"
              value={spells.spellClass}
              onChange={(e) => onChange('spells.spellClass', e.target.value)}
              placeholder="Wizard, Cleric, etc."
            />
          </div>
        </div>
      </section>

      <section className="card spells-section">
        <h3 className="section-title">Spells</h3>
        <SpellLevel 
          level={0} 
          levelName="Cantrips" 
          spells={spells}
          onChange={onChange}
          addSpell={addSpell}
          updateSpell={updateSpell}
          deleteSpell={deleteSpell}
          moveSpell={moveSpell}
          toggleSlot={toggleSlot}
          updateSlotCount={updateSlotCount}
        />
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => (
          <SpellLevel 
            key={level} 
            level={level} 
            levelName={`Level ${level}`}
            spells={spells}
            onChange={onChange}
            addSpell={addSpell}
            updateSpell={updateSpell}
            deleteSpell={deleteSpell}
            moveSpell={moveSpell}
            toggleSlot={toggleSlot}
            updateSlotCount={updateSlotCount}
          />
        ))}
      </section>
    </>
  )
}
