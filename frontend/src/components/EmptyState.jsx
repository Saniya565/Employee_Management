import { Inbox } from "lucide-react";
export default function EmptyState({ title="No records found", text="Try changing your filters or add a new record." }) {
  return <div className="empty-state"><div className="empty-icon"><Inbox/></div><h3>{title}</h3><p>{text}</p></div>;
}
