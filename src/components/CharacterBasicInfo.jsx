export default function CharacterBasicInfo({ data, onChange }) {
  return (
    <header className="character-header">
      <div className="card">
        <div className="info-group">
          <input
            type="text"
            value={data.charName}
            onChange={(e) => onChange('basicInfo.charName', e.target.value)}
            placeholder="Character Name"
          />
          <label>Character Name</label>
        </div>
        <div className="info-group">
          <input
            type="number"
            min="1"
            max="20"
            value={data.currentLevel}
            onChange={(e) => onChange('basicInfo.currentLevel', e.target.value)}
          />
          <label>Current Level</label>
        </div>
        <div className="info-group">
          <input
            type="text"
            value={data.level}
            onChange={(e) => onChange('basicInfo.level', e.target.value)}
            placeholder="Class/Level"
          />
          <label>Class/Level</label>
        </div>
        <div className="info-group">
          <input
            type="text"
            value={data.levelTwo}
            onChange={(e) => onChange('basicInfo.levelTwo', e.target.value)}
            placeholder="Class/Level"
          />
          <label>Multiclass</label>
        </div>
      </div>

      <div className="card">
        <div className="info-group">
          <input
            type="text"
            value={data.race}
            onChange={(e) => onChange('basicInfo.race', e.target.value)}
            placeholder="Race"
          />
          <label>Race</label>
        </div>
        <div className="info-group">
          <input
            type="text"
            value={data.background}
            onChange={(e) => onChange('basicInfo.background', e.target.value)}
            placeholder="Background"
          />
          <label>Background</label>
        </div>
        <div className="info-group">
          <input
            type="text"
            value={data.playerName}
            onChange={(e) => onChange('basicInfo.playerName', e.target.value)}
            placeholder="Player Name"
          />
          <label>Player Name</label>
        </div>
        <div className="info-group">
          <input
            type="text"
            value={data.exp}
            onChange={(e) => onChange('basicInfo.exp', e.target.value)}
            placeholder="Experience"
          />
          <label>Experience</label>
        </div>
        <div className="info-group">
          <input
            type="text"
            value={data.alignment}
            onChange={(e) => onChange('basicInfo.alignment', e.target.value)}
            placeholder="Alignment"
          />
          <label>Alignment</label>
        </div>
        <div className="info-group">
          <input
            type="text"
            value={data.deity}
            onChange={(e) => onChange('basicInfo.deity', e.target.value)}
            placeholder="Deity"
          />
          <label>Deity</label>
        </div>
      </div>
    </header>
  )
}
