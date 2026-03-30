import { useState } from 'react';
import styles from './PresetDetailPanel.module.css';
import FieldBadge from './FieldBadge';
import LocationSetDisplay from './LocationSetDisplay';
import { getIconUrl, getWikiUrl, getFieldsByIds, getIconSource } from '../services/schemaService';
import GeoIcon from './GeoIcon';

const GEO_LABELS = { point: 'Point', line: 'Line', area: 'Area', vertex: 'Vertex', relation: 'Relation' };

const ICON_SOURCE_COLORS = {
  maki: { bg: 'var(--blue-bg)', border: 'rgba(88,166,255,0.25)', color: 'var(--blue)' },
  temaki: { bg: 'var(--green-bg)', border: 'rgba(63,185,80,0.25)', color: 'var(--green)' },
  'fontawesome-solid': { bg: 'var(--yellow-bg)', border: 'rgba(210,153,34,0.25)', color: 'var(--yellow)' },
  'fontawesome-regular': { bg: 'var(--yellow-bg)', border: 'rgba(210,153,34,0.25)', color: 'var(--yellow)' },
  roentgen: { bg: 'var(--orange-bg)', border: 'rgba(240,136,62,0.25)', color: 'var(--orange)' },
  iD: { bg: 'var(--purple-bg)', border: 'rgba(139,92,246,0.25)', color: '#a78bfa' },
};

export default function PresetDetailPanel({ preset, fields, onClose }) {
  const [moreExpanded, setMoreExpanded] = useState(false);
  const [iconError, setIconError] = useState(false);

  if (!preset) return null;

  const iconUrl = getIconUrl(preset.icon);
  const iconSource = getIconSource(preset.icon);
  const wikiUrl = getWikiUrl(preset.reference || preset.tags);

  const primaryFields = getFieldsByIds(preset.fields, fields);
  const moreFields = getFieldsByIds(preset.moreFields, fields);

  const tagEntries = preset.tags ? Object.entries(preset.tags) : [];
  const addTagEntries = preset.addTags ? Object.entries(preset.addTags) : [];
  const removeTagEntries = preset.removeTags ? Object.entries(preset.removeTags) : [];

  // Compute extra addTags (those not already in tags)
  const tagKeys = new Set(tagEntries.map(([k]) => k));
  const extraAddTags = addTagEntries.filter(([k]) => !tagKeys.has(k));

  return (
    <>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={onClose} />

      {/* Panel */}
      <aside id="preset-detail-panel" className={`${styles.panel} panel`}>
        {/* Header */}
        <div className={styles.panelHeader}>
          <div className={styles.presetIconWrap}>
            {iconUrl && !iconError ? (
              <img
                src={iconUrl}
                alt={preset.icon}
                className={styles.presetIcon}
                onError={() => setIconError(true)}
              />
            ) : (
              <div className={styles.iconFallback}>
                <svg width="22" height="22" viewBox="0 0 15 15" fill="currentColor">
                  <path d="M7.5 0C4.9 0 2.5 2.1 2.5 5.5 2.5 9.5 7.5 15 7.5 15S12.5 9.5 12.5 5.5C12.5 2.1 10.1 0 7.5 0Zm0 7C6.7 7 6 6.3 6 5.5S6.7 4 7.5 4 9 4.7 9 5.5 8.3 7 7.5 7Z"/>
                </svg>
              </div>
            )}
          </div>
          <div className={styles.presetMeta}>
            <h2 className={styles.presetName}>{preset.name}</h2>
            <div className={styles.presetId}>{preset.id}</div>
          </div>
          <button id="close-detail-panel" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className={styles.scrollBody}>
          {/* Icon Source Badge */}
          {iconSource && (
            <Section title="Icon">
              <div className={styles.iconSourceRow}>
                {iconUrl && !iconError && (
                  <img src={iconUrl} alt="" className={styles.iconSourcePreview} />
                )}
                <div className={styles.iconSourceInfo}>
                  <span
                    className={styles.iconSourceBadge}
                    style={{
                      background: ICON_SOURCE_COLORS[iconSource]?.bg,
                      borderColor: ICON_SOURCE_COLORS[iconSource]?.border,
                      color: ICON_SOURCE_COLORS[iconSource]?.color,
                    }}
                  >
                    {iconSource}
                  </span>
                  <span className={styles.iconSourceId}>{preset.icon}</span>
                </div>
              </div>
            </Section>
          )}

          {/* OSM Tags */}
          <Section title="OSM Tags">
            <div className={styles.tagGrid}>
              {tagEntries.map(([key, value]) => (
                <div key={key} className={styles.tagRow}>
                  <span className={styles.tagKey}>{key}</span>
                  <span className={styles.tagEq}>=</span>
                  <span className={styles.tagValue}>{value === '*' ? <em style={{color:'var(--text-muted)'}}>any value</em> : value}</span>
                </div>
              ))}
            </div>
            {wikiUrl && (
              <a href={wikiUrl} target="_blank" rel="noopener noreferrer" className={styles.wikiLink}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                OSM Wiki
              </a>
            )}
          </Section>

          {/* Additional Tags (addTags that differ from base tags) */}
          {extraAddTags.length > 0 && (
            <Section title="Additional Tags (auto-added)">
              <div className={styles.tagGrid}>
                {extraAddTags.map(([key, value]) => (
                  <div key={key} className={styles.tagRow}>
                    <span className={styles.tagKeyAdd}>+ {key}</span>
                    <span className={styles.tagEq}>=</span>
                    <span className={styles.tagValue}>{value === '*' ? <em style={{color:'var(--text-muted)'}}>any value</em> : value}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Remove Tags */}
          {removeTagEntries.length > 0 && (
            <Section title="Removed Tags (auto-removed)">
              <div className={styles.tagGrid}>
                {removeTagEntries.map(([key, value]) => (
                  <div key={key} className={styles.tagRow}>
                    <span className={styles.tagKeyRemove}>− {key}</span>
                    <span className={styles.tagEq}>=</span>
                    <span className={styles.tagValueRemove}>{value === '*' ? <em>any</em> : value}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Geometry */}
          <Section title="Geometry">
            <div className={styles.geoChips}>
              {(preset.geometry || []).map(geo => (
                <span key={geo} className={`geo-chip ${geo}`}>
                  <GeoIcon geo={geo} />
                  {GEO_LABELS[geo] || geo}
                </span>
              ))}
            </div>
          </Section>

          {/* Primary Fields */}
          {primaryFields.length > 0 && (
            <Section title={`Fields (${primaryFields.length})`}>
              <div className={styles.fieldList}>
                {primaryFields.map(f => <FieldBadge key={f.id} field={f} />)}
              </div>
            </Section>
          )}

          {/* More Fields */}
          {moreFields.length > 0 && (
            <Section title={`More Fields (${moreFields.length})`}>
              <button
                id="toggle-more-fields"
                className={styles.expandBtn}
                onClick={() => setMoreExpanded(e => !e)}
              >
                {moreExpanded ? '▲ Collapse' : '▼ Show all'}
              </button>
              {moreExpanded && (
                <div className={styles.moreFieldList}>
                  {moreFields.map(f => <FieldBadge key={f.id} field={f} />)}
                </div>
              )}
            </Section>
          )}

          {/* Reference */}
          {preset.reference && (
            <Section title="Wiki Reference">
              <div className={styles.referenceRow}>
                <span className={styles.tagKey}>{preset.reference.key}</span>
                {preset.reference.value && (
                  <>
                    <span className={styles.tagEq}>=</span>
                    <span className={styles.tagValue}>{preset.reference.value}</span>
                  </>
                )}
              </div>
            </Section>
          )}

          {/* Match Score */}
          {preset.matchScore != null && preset.matchScore !== 1 && (
            <Section title="Match Score">
              <div className={styles.matchScoreRow}>
                <div className={styles.matchScoreBar}>
                  <div
                    className={styles.matchScoreFill}
                    style={{ width: `${Math.min(preset.matchScore * 100, 100)}%` }}
                  />
                </div>
                <span className={styles.matchScoreValue}>{preset.matchScore}</span>
              </div>
            </Section>
          )}

          {/* Terms */}
          {preset.terms?.length > 0 && (
            <Section title="Search Terms">
              <div className={styles.termsList}>
                {preset.terms.map(t => (
                  <span key={t} className={styles.termChip}>{t}</span>
                ))}
              </div>
            </Section>
          )}

          {/* LocationSet */}
          {preset.locationSet && (
            <Section title="Regional Availability">
              <LocationSetDisplay locationSet={preset.locationSet} />
            </Section>
          )}

          {/* Aliases */}
          {preset.aliases?.length > 0 && (
            <Section title="Aliases">
              <div className={styles.termsList}>
                {preset.aliases.map(a => (
                  <span key={a} className={styles.aliasChip}>{a}</span>
                ))}
              </div>
            </Section>
          )}
        </div>
      </aside>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>
        <span>{title}</span>
      </div>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  );
}
