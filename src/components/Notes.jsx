export default function Notes({ data, onChange }) {
  return (
    <section className="card">
      <h3 className="section-title">Notes</h3>
      <div className="notes-grid">
        <div className="notes-item">
          <label>Notes 1</label>
          <textarea
            value={data.notes1}
            onChange={(e) => onChange('notes.notes1', e.target.value)}
            rows="20"
            placeholder="General notes, quest information, etc."
          />
        </div>
        <div className="notes-item">
          <label>Notes 2</label>
          <textarea
            value={data.notes2}
            onChange={(e) => onChange('notes.notes2', e.target.value)}
            rows="20"
            placeholder="Additional notes"
          />
        </div>
      </div>
    </section>
  )
}
