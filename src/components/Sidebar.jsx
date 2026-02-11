export default function Sidebar({ 
  isOpen, 
  onClose, 
  currentPage, 
  onPageChange,
  onClearSheet,
  onSaveBackup,
  onLoadBackup
}) {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="close-button" onClick={onClose}>
          Close &times;
        </button>
        
        <a 
          href="#"
          className={`sidebar-item ${currentPage === 'attributes' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); onPageChange('attributes'); }}
        >
          Attributes
        </a>
        
        <a 
          href="#"
          className={`sidebar-item ${currentPage === 'backstory' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); onPageChange('backstory'); }}
        >
          Backstory
        </a>
        
        <a 
          href="#"
          className={`sidebar-item ${currentPage === 'equipment' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); onPageChange('equipment'); }}
        >
          Inv. & NPCs
        </a>
        
        <a 
          href="#"
          className={`sidebar-item ${currentPage === 'spells' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); onPageChange('spells'); }}
        >
          Spell Sheet
        </a>
        
        <a 
          href="#"
          className={`sidebar-item ${currentPage === 'notes' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); onPageChange('notes'); }}
        >
          Notes
        </a>

        <div className="sidebar-options">
          <div className="sidebar-label">Options</div>
          <a href="#" className="sidebar-item" onClick={(e) => { e.preventDefault(); onClearSheet(); }}>
            Clear Sheet
          </a>
          <a href="#" className="sidebar-item" onClick={(e) => { e.preventDefault(); onSaveBackup(); }}>
            Save Backup
          </a>
          <a href="#" className="sidebar-item" onClick={(e) => { e.preventDefault(); onLoadBackup(); }}>
            Load Backup
          </a>
        </div>

        <div className="sidebar-info">
          <div className="sidebar-label">Info & Help</div>
          <div className="info-item">
            <span className="auto-filled-example">Alt Color</span> = Auto-Filled
          </div>
          <div className="info-item">
            <strong>Auto-Save:</strong> Your changes are saved locally in your browser every second. 
            No internet or manual saving needed!
          </div>
          <div className="info-item">
            <strong>Clear Sheet:</strong> Clears everything to create a new character. 
            All current data will be deleted.
          </div>
          <div className="info-item">
            <strong>Save Backup:</strong> Downloads your character to a JSON file for backup.
          </div>
          <div className="info-item">
            <strong>Load Backup:</strong> Loads a character from a JSON backup file.
          </div>
        </div>
      </div>
    </>
  )
}
