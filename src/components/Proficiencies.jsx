export default function Proficiencies({ data, onChange }) {
  return (
    <section className="card">
      <h3 className="section-title">Proficiencies</h3>
      <div className="proficiencies-grid">
        <div className="prof-item">
          <label>Languages</label>
          <textarea
            value={data.languages}
            onChange={(e) => onChange('proficiencies.languages', e.target.value)}
            rows="3"
            placeholder="Common, Elvish, etc."
          />
        </div>
        <div className="prof-item">
          <label>Armor</label>
          <textarea
            value={data.armor}
            onChange={(e) => onChange('proficiencies.armor', e.target.value)}
            rows="3"
            placeholder="Light, Medium, Heavy, Shields"
          />
        </div>
        <div className="prof-item">
          <label>Weapons</label>
          <textarea
            value={data.weapons}
            onChange={(e) => onChange('proficiencies.weapons', e.target.value)}
            rows="3"
            placeholder="Simple, Martial, etc."
          />
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
      </div>
    </section>
  )
}
