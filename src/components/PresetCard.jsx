import { useState } from 'react';
import styles from './PresetCard.module.css';
import { getIconUrl, getTagString } from '../services/schemaService';
import GeoIcon from './GeoIcon';

export default function PresetCard({ preset, onSelect }) {
  const [iconError, setIconError] = useState(false);
  const iconUrl = getIconUrl(preset.icon);
  const tagStr = getTagString(preset.tags);

  return (
    <article
      id={`preset-card-${preset.id.replace(/\//g, '-')}`}
      className={`${styles.card} panel`}
      onClick={() => onSelect(preset)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(preset); }}
      title={preset.name}
      role="button"
      tabIndex={0}
    >
      <div className={styles.iconWrap}>
        {iconUrl && !iconError ? (
          <img
            src={iconUrl}
            alt={preset.icon}
            className={styles.icon}
            onError={() => setIconError(true)}
          />
        ) : (
          <div className={styles.iconFallback}>
            <svg width="18" height="18" viewBox="0 0 15 15" fill="currentColor">
              <path d="M7.5 0C4.9 0 2.5 2.1 2.5 5.5 2.5 9.5 7.5 15 7.5 15S12.5 9.5 12.5 5.5C12.5 2.1 10.1 0 7.5 0Zm0 7C6.7 7 6 6.3 6 5.5S6.7 4 7.5 4 9 4.7 9 5.5 8.3 7 7.5 7Z"/>
            </svg>
          </div>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.name}>{preset.name}</div>
        {tagStr && (
          <div className={`${styles.tag} tag-chip`}>{tagStr}</div>
        )}
        <div className={styles.geos}>
          {(preset.geometry || []).slice(0, 3).map(geo => (
            <span key={geo} className={`${styles.geo} geo-chip ${geo}`}>
              <GeoIcon geo={geo} />
            </span>
          ))}
          {preset.locationSet && (
            <span className={styles.regional} title="Regional preset">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
