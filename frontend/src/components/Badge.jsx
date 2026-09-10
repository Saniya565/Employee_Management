export default function Badge({ children, tone }) {
  const key = tone || String(children).toLowerCase().replace(/\s/g, "-");
  return <span className={`badge badge-${key}`}>{children}</span>;
}
