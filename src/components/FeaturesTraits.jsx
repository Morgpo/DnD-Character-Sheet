export default function FeaturesTraits({ data, onChange }) {
  return (
    <section className="card">
      <h3 className="section-title">Features & Traits</h3>
      <textarea
        value={data}
        onChange={(e) => onChange('features', e.target.value)}
        rows="15"
        placeholder="Enter your character's features, traits, racial abilities, class features, etc."
      />
    </section>
  )
}
