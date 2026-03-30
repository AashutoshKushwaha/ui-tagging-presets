import styles from './FieldBadge.module.css';

const TYPE_META = {
  text:           { color: 'blue',   label: 'text' },
  number:         { color: 'blue',   label: 'number' },
  combo:          { color: 'green',  label: 'combo' },
  typeCombo:      { color: 'green',  label: 'typeCombo' },
  semiCombo:      { color: 'green',  label: 'semiCombo' },
  multiCombo:     { color: 'green',  label: 'multiCombo' },
  manyCombo:      { color: 'green',  label: 'manyCombo' },
  check:          { color: 'yellow', label: 'check' },
  defaultCheck:   { color: 'yellow', label: 'check' },
  radio:          { color: 'yellow', label: 'radio' },
  localized:      { color: 'purple', label: 'localized' },
  url:            { color: 'blue',   label: 'url' },
  email:          { color: 'blue',   label: 'email' },
  phone:          { color: 'blue',   label: 'phone' },
  textarea:       { color: 'blue',   label: 'textarea' },
  date:           { color: 'orange', label: 'date' },
  address:        { color: 'orange', label: 'address' },
  wikipedia:      { color: 'purple', label: 'wikipedia' },
  wikidata:       { color: 'purple', label: 'wikidata' },
  identifier:     { color: 'purple', label: 'identifier' },
  structuredText: { color: 'orange', label: 'structured' },
  structureRadio: { color: 'yellow', label: 'structure' },
  restrictions:   { color: 'red',    label: 'restrictions' },
};

export default function FieldBadge({ field }) {
  if (!field) return null;
  const meta = TYPE_META[field.type] || { color: 'blue', label: field.type || '?' };
  const displayKey = field.key || field.keys?.join(', ') || field.id;
  const displayLabel = field.label || displayKey;

  return (
    <div className={`${styles.badge} ${styles[meta.color]}`}>
      <span className={styles.type}>{meta.label}</span>
      <span className={styles.key}>{displayKey}</span>
      {field.universal && <span className={styles.universal} title="Universal field">∞</span>}
    </div>
  );
}
