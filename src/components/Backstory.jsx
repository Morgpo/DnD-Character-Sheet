export default function Backstory({ data, onChange }) {
  return (
    <>
      <section className="card">
        <h3 className="section-title">Personality</h3>
        <div className="personality-grid">
          <div className="personality-item">
            <label>Personality Traits</label>
            <textarea
              value={data.personality}
              onChange={(e) => onChange('backstory.personality', e.target.value)}
              rows="5"
              placeholder="Your character's personality traits"
            />
          </div>
          <div className="personality-item">
            <label>Ideals</label>
            <textarea
              value={data.ideals}
              onChange={(e) => onChange('backstory.ideals', e.target.value)}
              rows="5"
              placeholder="Your character's ideals"
            />
          </div>
          <div className="personality-item">
            <label>Bonds</label>
            <textarea
              value={data.bonds}
              onChange={(e) => onChange('backstory.bonds', e.target.value)}
              rows="5"
              placeholder="Your character's bonds"
            />
          </div>
          <div className="personality-item">
            <label>Flaws</label>
            <textarea
              value={data.flaws}
              onChange={(e) => onChange('backstory.flaws', e.target.value)}
              rows="5"
              placeholder="Your character's flaws"
            />
          </div>
        </div>
      </section>

      <section className="card">
        <h3 className="section-title">Backstory</h3>
        <div className="backstory-grid">
          <div className="backstory-item">
            <label>Backstory</label>
            <textarea
              value={data.backstory}
              onChange={(e) => onChange('backstory.backstory', e.target.value)}
              rows="15"
              placeholder="Your character's history and background"
            />
          </div>
          <div className="backstory-item">
            <label>Appearance</label>
            <textarea
              value={data.appearance}
              onChange={(e) => onChange('backstory.appearance', e.target.value)}
              rows="15"
              placeholder="Physical description of your character"
            />
          </div>
          <div className="backstory-item full-width">
            <label>Allies & Organizations</label>
            <textarea
              value={data.allies}
              onChange={(e) => onChange('backstory.allies', e.target.value)}
              rows="10"
              placeholder="Important NPCs, allies, and organizations"
            />
          </div>
        </div>
      </section>
    </>
  )
}
