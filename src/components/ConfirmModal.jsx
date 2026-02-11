import './ConfirmModal.css'

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{message.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i < message.split('\n').length - 1 && <br />}
          </span>
        ))}</p>
        <div className="confirm-modal-buttons">
          <button className="confirm-button cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-button confirm" onClick={onConfirm}>
            OK
          </button>
        </div>
      </div>
    </div>
  )
}
