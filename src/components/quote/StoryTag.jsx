import { useState } from 'react';

const STORY_MAP = {
  1:  { id: 'OM-006', owner: 'MS' },
  2:  { id: 'OM-007', owner: 'AL' },
  3:  { id: 'OM-009 / OM-010', owner: 'AL / MS' },
  4:  { id: 'OM-011', owner: 'MS' },
  5:  { id: 'OM-012', owner: 'AL' },
  6:  { id: 'OM-014', owner: 'Unassigned' },
  7:  { id: 'OM-015', owner: 'MS' },
  8:  { id: 'OM-016', owner: 'AL' },
  9:  { id: 'OM-017', owner: 'MS' },
  10: { id: 'OM-018', owner: 'AL' },
  11: { id: 'OM-019', owner: 'TBC' },
  12: { id: 'OM-020', owner: 'AL' },
  13: { id: 'OM-021', owner: 'AL' },
  14: { id: 'OM-022', owner: 'MS' },
  15: { id: 'OM-026', owner: 'MS' },
  16: { id: 'OM-027', owner: 'MS' },
  17: { id: 'OM-023', owner: 'AL' },
  18: { id: 'OM-024', owner: 'MS' },
  19: { id: 'OM-025', owner: 'AL' },
};

export default function StoryTag({ step }) {
  const [expanded, setExpanded] = useState(false);
  const story = STORY_MAP[step];
  if (!story) return null;

  return (
    <button
      type="button"
      onClick={() => setExpanded(e => !e)}
      style={{
        position: 'fixed', bottom: '10px', right: '10px',
        background: '#DDDBDD', color: '#333F48',
        fontSize: '10px', borderRadius: '4px', border: 'none',
        cursor: 'pointer', opacity: expanded ? 1 : 0.75,
        padding: expanded ? '3px 7px' : '3px 6px',
        fontFamily: 'Montserrat, sans-serif', fontWeight: 600,
        lineHeight: 1.4, zIndex: 9999, whiteSpace: 'nowrap',
        transition: 'opacity 0.15s, padding 0.15s', userSelect: 'none',
      }}
    >
      {expanded ? `${story.id} · Owner: ${story.owner}` : 'ℹ'}
    </button>
  );
}