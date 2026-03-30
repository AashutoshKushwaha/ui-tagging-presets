import styles from './CategorySidebar.module.css';
import { getIconUrl } from '../services/schemaService';

export default function CategorySidebar({ categories, activeCategory, onCategoryChange }) {
  return (
    <aside className={`${styles.sidebar} panel`}>
      <div className={styles.sectionTitle}>Categories</div>
      <ul className={styles.list}>
        <li>
          <button
            id="category-all"
            className={`${styles.item} ${!activeCategory ? styles.active : ''}`}
            onClick={() => onCategoryChange(null)}
          >
            <span className={styles.iconWrapper}>✨</span>
            <span className={styles.name}>All Presets</span>
          </button>
        </li>
        {categories.map(cat => {
          const iconUrl = getIconUrl(cat.icon);
          return (
            <li key={cat.id}>
              <button
                id={`category-${cat.id}`}
                className={`${styles.item} ${activeCategory === cat.id ? styles.active : ''}`}
                onClick={() => onCategoryChange(activeCategory === cat.id ? null : cat.id)}
              >
                <span className={styles.iconWrapper}>
                  {iconUrl ? (
                    <img src={iconUrl} alt="" className={styles.categoryIcon} />
                  ) : (
                    <span className={styles.fallbackIcon}>📁</span>
                  )}
                </span>
                <span className={styles.name}>{cat.name}</span>
                <span className={styles.count}>{cat.members?.length || 0}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
