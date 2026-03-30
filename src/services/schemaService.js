const CDN_BASE = 'https://cdn.jsdelivr.net/npm/@openstreetmap/id-tagging-schema@latest/dist';

export async function loadSchema() {
  const [presetsRes, fieldsRes, categoriesRes, translationsRes] = await Promise.all([
    fetch(`${CDN_BASE}/presets.min.json`),
    fetch(`${CDN_BASE}/fields.min.json`),
    fetch(`${CDN_BASE}/preset_categories.min.json`),
    fetch(`${CDN_BASE}/translations/en.min.json`),
  ]);

  if (!presetsRes.ok || !fieldsRes.ok || !categoriesRes.ok || !translationsRes.ok) {
    throw new Error('Failed to load schema from CDN');
  }

  const [presetsRaw, fieldsRaw, categoriesRaw, translationsRaw] = await Promise.all([
    presetsRes.json(),
    fieldsRes.json(),
    categoriesRes.json(),
    translationsRes.json(),
  ]);

  // English strings: en.presets.presets → { "amenity/cafe": { name, terms, aliases }, ... }
  const enPresets = translationsRaw?.en?.presets?.presets || {};
  // English strings: en.presets.categories → { "category-road_major": { name }, ... }
  const enCategories = translationsRaw?.en?.presets?.categories || {};

  // Flatten presets to array, merge English name/terms from translations
  const presets = Object.entries(presetsRaw)
    .map(([id, data]) => {
      const en = enPresets[id] || {};
      // Merge English name and terms (translations take priority for name)
      const name = en.name || data.name || '';
      const terms = en.terms
        ? (typeof en.terms === 'string' ? en.terms.split(',').map(t => t.trim()) : en.terms)
        : (Array.isArray(data.terms) ? data.terms : []);
      const aliases = en.aliases
        ? (typeof en.aliases === 'string' ? en.aliases.split(',').map(a => a.trim()) : en.aliases)
        : (Array.isArray(data.aliases) ? data.aliases : []);

      return {
        id,
        ...data,
        name,
        terms,
        aliases,
        // Flatten tags for Fuse.js search: "amenity=cafe"
        _tagString: data.tags
          ? Object.entries(data.tags).map(([k, v]) => `${k}=${v}`).join(' ')
          : '',
        // Flatten terms for Fuse.js search
        _termsString: terms.join(' '),
      };
    })
    // Only keep presets that have a name AND are not explicitly unsearchable
    .filter(p => p.name && p.searchable !== false);

  const fields = fieldsRaw;

  // Build categories with proper English names from translations
  const categories = Object.entries(categoriesRaw).map(([id, data]) => ({
    id,
    ...data,
    name: enCategories[id]?.name || formatCategoryName(id),
  }));

  return { presets, fields, categories };
}

function formatCategoryName(id) {
  // Fallback: "category-road_major" → "Road Major"
  return id
    .replace('category-', '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

export function getIconUrl(icon) {
  if (!icon) return null;
  if (icon.startsWith('maki-')) {
    const name = icon.replace('maki-', '');
    return `https://cdn.jsdelivr.net/npm/@mapbox/maki@latest/icons/${name}.svg`;
  }
  if (icon.startsWith('temaki-')) {
    const name = icon.replace('temaki-', '');
    return `https://cdn.jsdelivr.net/gh/bhousel/temaki@main/icons/${name}.svg`;
  }
  if (icon.startsWith('fas-') || icon.startsWith('far-')) {
    return `https://cdn.jsdelivr.net/gh/openstreetmap/iD@develop/svg/fontawesome/${icon}.svg`;
  }
  if (icon.startsWith('roentgen-')) {
    const name = icon.replace('roentgen-', '');
    return `https://cdn.jsdelivr.net/gh/enzet/Roentgen@master/icons/${name}.svg`;
  }
  if (icon.startsWith('iD-')) {
    const name = icon.replace('iD-', '');
    return `https://cdn.jsdelivr.net/gh/openstreetmap/iD@develop/svg/iD-sprite/presets/${name}.svg`;
  }
  return null;
}

/** Returns the icon set name for display purposes */
export function getIconSource(icon) {
  if (!icon) return null;
  if (icon.startsWith('maki-')) return 'maki';
  if (icon.startsWith('temaki-')) return 'temaki';
  if (icon.startsWith('fas-')) return 'fontawesome-solid';
  if (icon.startsWith('far-')) return 'fontawesome-regular';
  if (icon.startsWith('roentgen-')) return 'roentgen';
  if (icon.startsWith('iD-')) return 'iD';
  return null;
}

export function getTagString(tags) {
  if (!tags) return '';
  return Object.entries(tags)
    .map(([k, v]) => `${k}=${v}`)
    .join(' · ');
}

export function getWikiUrl(tags) {
  if (!tags) return null;
  const entries = Object.entries(tags);
  if (!entries.length) return null;
  const [key, value] = entries[0];
  if (value && value !== '*') {
    return `https://wiki.openstreetmap.org/wiki/Tag:${key}=${value}`;
  }
  return `https://wiki.openstreetmap.org/wiki/Key:${key}`;
}

export function getFieldsByIds(ids, fieldsMap) {
  if (!ids || !fieldsMap) return [];
  return ids
    .filter(id => !id.startsWith('{') && !id.startsWith('@'))
    .map(id => ({ id, ...(fieldsMap[id] || {}) }))
    .filter(f => f.key || f.type);
}
