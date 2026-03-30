import PresetCard from './PresetCard';
import styles from './PresetGrid.module.css';

export default function PresetGrid({ presets, onSelect, loading }) {
  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingDots}>
          <div className={`${styles.dot} loading-dots`}>
            <span /><span /><span />
          </div>
          <p className={styles.loadingText}>Loading {' '}<strong>1,200+ presets</strong> from CDN…</p>
        </div>
      </div>
    );
  }

  if (!presets.length) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <p className={styles.emptyTitle}>No presets found</p>
        <p className={styles.emptyHint}>Try a different search term or remove filters</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {presets.map(preset => (
        <PresetCard
          key={preset.id}
          preset={preset}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
