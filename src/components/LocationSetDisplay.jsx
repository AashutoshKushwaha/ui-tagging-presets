import styles from './LocationSetDisplay.module.css';

// Common country codes to country names
const COUNTRY_NAMES = {
  us: 'United States', gb: 'United Kingdom', de: 'Germany', fr: 'France',
  ca: 'Canada', au: 'Australia', jp: 'Japan', cn: 'China', in: 'India',
  br: 'Brazil', ru: 'Russia', it: 'Italy', es: 'Spain', mx: 'Mexico',
  pl: 'Poland', nl: 'Netherlands', se: 'Sweden', no: 'Norway', fi: 'Finland',
  dk: 'Denmark', at: 'Austria', ch: 'Switzerland', be: 'Belgium', pt: 'Portugal',
  ar: 'Argentina', nz: 'New Zealand', za: 'South Africa', kr: 'South Korea',
  tw: 'Taiwan', tr: 'Turkey', ie: 'Ireland', cz: 'Czech Republic', gr: 'Greece',
  ro: 'Romania', hu: 'Hungary', sk: 'Slovakia', ua: 'Ukraine',
};

function getFlagEmoji(code) {
  if (!code || code.length !== 2) return '🏳️';
  return String.fromCodePoint(
    ...code.toUpperCase().split('').map(c => 0x1F1E0 + c.charCodeAt(0) - 65)
  );
}

function CountryChip({ code, variant }) {
  const name = COUNTRY_NAMES[code.toLowerCase()] || code.toUpperCase();
  const flag = getFlagEmoji(code);
  return (
    <span
      className={`${styles.chip} ${styles[variant]}`}
      title={name}
    >
      {flag} {code.toUpperCase()}
    </span>
  );
}

export default function LocationSetDisplay({ locationSet }) {
  if (!locationSet) return <span className={styles.global}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:4}}>
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
    Global
  </span>;

  const includes = locationSet.include || [];
  const excludes = locationSet.exclude || [];

  if (!includes.length && !excludes.length) {
    return <span className={styles.global}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:4}}>
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
      Global
    </span>;
  }

  return (
    <div className={styles.wrap}>
      {includes.length > 0 && (
        <div className={styles.group}>
          <span className={styles.groupLabel}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="3" style={{marginRight:4}}>
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Available in
          </span>
          <div className={styles.chips}>
            {includes.map(code => (
              <CountryChip key={code} code={code} variant="include" />
            ))}
          </div>
        </div>
      )}
      {excludes.length > 0 && (
        <div className={styles.group}>
          <span className={styles.groupLabel}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="3" style={{marginRight:4}}>
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Not available in
          </span>
          <div className={styles.chips}>
            {excludes.map(code => (
              <CountryChip key={code} code={code} variant="exclude" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
