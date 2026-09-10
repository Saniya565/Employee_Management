import { X } from "lucide-react";
export default function Modal({ open, title, children, onClose, wide=false }) {
  if (!open) return null;
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <div className={`modal ${wide ? "modal-wide" : ""}`}>
      <div className="modal-head"><div><div className="eyebrow">SCORECARE HR</div><h2>{title}</h2></div><button className="icon-btn" onClick={onClose}><X/></button></div>
      <div className="modal-body">{children}</div>
    </div>
  </div>;
}
