import styles from './Header.module.css';
import GeoIcon from './GeoIcon';

const GEO_FILTERS = ['point', 'line', 'area', 'vertex', 'relation'];

export default function Header({ query, onQueryChange, geoFilter, onGeoFilter, totalCount, visibleCount }) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <img src="/osm_logo.svg" alt="OSM Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div>
          <h1 className={styles.title}>OSM Preset Explorer</h1>
          <p className={styles.subtitle}>
            {totalCount > 0 ? `${visibleCount} of ${totalCount} presets` : 'Loading…'}
          </p>
        </div>
      </div>

      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          id="preset-search"
          className={styles.searchInput}
          type="text"
          placeholder="Search presets, tags, or terms…"
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          autoComplete="off"
          spellCheck="false"
        />
        {query && (
          <button className={styles.clearBtn} onClick={() => onQueryChange('')} aria-label="Clear search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      <div className={styles.geoFilters}>
        <span className={styles.filterLabel}>Geometry</span>
        {GEO_FILTERS.map(geo => (
          <button
            key={geo}
            className={`${styles.geoBtn} ${geoFilter === geo ? styles.active : ''} geo-chip ${geo}`}
            onClick={() => onGeoFilter(geoFilter === geo ? null : geo)}
          >
            <GeoIcon geo={geo} />
            {geo}
          </button>
        ))}
      </div>
    </header>
  );
}


