export default function GeoIcon({ geo }) {
  if (geo === 'point') return <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" fill="currentColor"/></svg>;
  if (geo === 'line')  return <svg width="10" height="8" viewBox="0 0 10 8"><line x1="1" y1="7" x2="9" y2="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
  if (geo === 'area')  return <svg width="10" height="8" viewBox="0 0 10 8"><rect x="1" y="1" width="8" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>;
  if (geo === 'vertex') return <svg width="8" height="8" viewBox="0 0 8 8"><rect x="1.5" y="1.5" width="5" height="5" transform="rotate(45 4 4)" fill="currentColor"/></svg>;
  if (geo === 'relation') return <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>;
  return null;
}
