export default function Proficiencies({ data, onChange }) {
  const armor = typeof data.armor === 'object' && data.armor !== null ? data.armor : {}
  const weapons = typeof data.weapons === 'object' && data.weapons !== null ? data.weapons : {}

  const updateArmor = (key, value) => {
    onChange('proficiencies.armor', { ...armor, [key]: value })
  }

  const updateWeapons = (key, value) => {
    onChange('proficiencies.weapons', { ...weapons, [key]: value })
  }

  return (
    <section className="card">
      <h3 className="section-title">Proficiencies</h3>
      <div className="proficiencies-grid">
        <div className="prof-item">
          <label>Armor</label>
          <div className="checkbox-list">
            <label>
              <input
                type="checkbox"
                checked={Boolean(armor.light)}
                onChange={(e) => updateArmor('light', e.target.checked)}
              />
              Light
            </label>
            <label>
              <input
                type="checkbox"
                checked={Boolean(armor.medium)}
                onChange={(e) => updateArmor('medium', e.target.checked)}
              />
              Medium
            </label>
            <label>
              <input
                type="checkbox"
                checked={Boolean(armor.heavy)}
                onChange={(e) => updateArmor('heavy', e.target.checked)}
              />
              Heavy
            </label>
            <label>
              <input
                type="checkbox"
                checked={Boolean(armor.shields)}
                onChange={(e) => updateArmor('shields', e.target.checked)}
              />
              Shields
            </label>
          </div>
        </div>
        <div className="prof-item">
          <label>Weapons</label>
          <div className="checkbox-list">
            <label>
              <input
                type="checkbox"
                checked={Boolean(weapons.simple)}
                onChange={(e) => updateWeapons('simple', e.target.checked)}
              />
              Simple
            </label>
            <label>
              <input
                type="checkbox"
                checked={Boolean(weapons.martial)}
                onChange={(e) => updateWeapons('martial', e.target.checked)}
              />
              Martial
            </label>
          </div>
        </div>
        <div className="prof-item">
          <label>Tools</label>
          <textarea
            value={data.tools}
            onChange={(e) => onChange('proficiencies.tools', e.target.value)}
            rows="3"
            placeholder="Thieves' tools, etc."
          />
        </div>
        <div className="prof-item">
          <label>Languages</label>
          <textarea
            value={data.languages}
            onChange={(e) => onChange('proficiencies.languages', e.target.value)}
            rows="3"
            placeholder="Common, Elvish, etc."
          />
        </div>
      </div>
    </section>
  )
}
