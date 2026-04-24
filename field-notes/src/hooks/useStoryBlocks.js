export function emptyStoryBuilder() {
  return {
    hook:         { title: '', contextLine: '', opening: '' },
    problem:      { name: '', evidence: '', competitive: '' },
    turningPoint: { insight: '', rejected: '' },
    role:         { contribution: '', successCriteria: '' },
    process:      { cards: [{ id: 1, name: '', built: '', rejected: '', impact: '' }] },
    outcome:      { changed: '', honest: '' },
    learning:     { text: '' },
    next:         { directions: '' },
  };
}

const SECTION_WEIGHTS = {
  hook:         { fields: ['title', 'contextLine', 'opening'], weight: 1 },
  problem:      { fields: ['name', 'evidence', 'competitive'], weight: 1 },
  turningPoint: { fields: ['insight', 'rejected'],             weight: 1 },
  role:         { fields: ['contribution', 'successCriteria'], weight: 1 },
  process:      { weight: 1 },
  outcome:      { fields: ['changed', 'honest'],               weight: 1 },
  learning:     { fields: ['text'],                            weight: 1 },
  next:         { fields: ['directions'],                      weight: 1 },
};

export function calcCompleteness(sb) {
  if (!sb) return 0;
  let filled = 0;
  let total  = 0;

  for (const [key, cfg] of Object.entries(SECTION_WEIGHTS)) {
    total += cfg.weight;
    if (key === 'process') {
      const section = sb[key] || {};
      const cards = Array.isArray(section) ? section : (section.cards || []);
      if (cards.some(c => c.name && c.name.trim())) filled += cfg.weight;
    } else {
      const section = sb[key] || {};
      const fields  = cfg.fields || [];
      const filledCount = fields.filter(f => section[f] && section[f].trim()).length;
      filled += cfg.weight * (filledCount / fields.length);
    }
  }

  return Math.round((filled / total) * 100);
}
