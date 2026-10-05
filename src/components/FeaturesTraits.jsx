export default function FeaturesTraits({ data, onChange }) {
  return (
    <section className="card">
      <h3 className="section-title">Features & Traits</h3>
      <div className="features-grid">
        <div className="feature-item">
          <label>Feats</label>
          <textarea
            value={data.feats || ''}
            onChange={(e) => onChange('features.feats', e.target.value)}
            rows="4"
            placeholder="Lucky, Alert, Sentinel, etc."
          />
        </div>
        <div className="feature-item">
          <label>Racial Traits</label>
          <textarea
            value={data.racialTraits || ''}
            onChange={(e) => onChange('features.racialTraits', e.target.value)}
            rows="4"
            placeholder="Darkvision, Fey Ancestry, etc."
          />
        </div>
        <div className="feature-item">
          <label>Class Features</label>
          <textarea
            value={data.classFeatures || ''}
            onChange={(e) => onChange('features.classFeatures', e.target.value)}
            rows="4"
            placeholder="Rage, Sneak Attack, Spellcasting, etc."
          />
        </div>
        <div className="feature-item">
          <label>Misc Features</label>
          <textarea
            value={data.backgroundFeatures || ''}
            onChange={(e) => onChange('features.backgroundFeatures', e.target.value)}
            rows="4"
            placeholder="Other notable traits, features, or abilities not covered above."
          />
        </div>
      </div>
    </section>
  )
}
