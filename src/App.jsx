import { useState, useMemo } from 'react';
import { useSchemaData } from './hooks/useSchemaData';
import Header from './components/Header';
import CategorySidebar from './components/CategorySidebar';
import PresetGrid from './components/PresetGrid';
import PresetDetailPanel from './components/PresetDetailPanel';
import styles from './App.module.css';

export default function App() {
  const { presets, fields, categories, fuse, loading, error } = useSchemaData();

  const [query, setQuery] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [geoFilter, setGeoFilter] = useState(null);

  // Filtered / searched presets
  const filteredPresets = useMemo(() => {
    let result = presets;

    // 1. Search with Fuse.js
    if (query.trim() && fuse) {
      result = fuse.search(query.trim()).map(r => r.item);
    }

    // 2. Category filter
    if (activeCategory) {
      const cat = categories.find(c => c.id === activeCategory);
      if (cat?.members) {
        const memberSet = new Set(cat.members);
        result = result.filter(p => memberSet.has(p.id));
      }
    }

    // 3. Geometry filter
    if (geoFilter) {
      result = result.filter(p => p.geometry?.includes(geoFilter));
    }

    return result;
  }, [query, fuse, activeCategory, geoFilter, presets, categories]);

  if (error) {
    return (
      <div className={styles.error}>
        <div className={styles.errorIcon}>⚠️</div>
        <h2>Failed to load schema</h2>
        <p>{error.message}</p>
        <button className={styles.retryBtn} onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <Header
        query={query}
        onQueryChange={setQuery}
        geoFilter={geoFilter}
        onGeoFilter={setGeoFilter}
        totalCount={presets.length}
        visibleCount={filteredPresets.length}
      />

      <div className={styles.body}>
        <CategorySidebar
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <main className={styles.main}>
          <PresetGrid
            presets={filteredPresets}
            onSelect={setSelectedPreset}
            loading={loading}
          />
        </main>
      </div>

      {selectedPreset && (
        <PresetDetailPanel
          preset={selectedPreset}
          fields={fields}
          onClose={() => setSelectedPreset(null)}
        />
      )}
    </div>
  );
}
