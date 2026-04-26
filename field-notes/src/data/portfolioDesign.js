// Portfolio design system — curated options that always look good
// Each axis maps to CSS custom properties applied on .pf-content

export const DISPLAY_FONTS = [
  {
    id:      'geist',
    name:    'Modern Sans',
    preview: 'Geist',
    desc:    'Clean and contemporary',
    vars: {
      '--pf-title-family':    "'Geist', system-ui, sans-serif",
      '--pf-title-style':     'normal',
      '--pf-title-weight':    '300',
      '--pf-title-size':      '2rem',
      '--pf-insight-family':  "'Geist', system-ui, sans-serif",
      '--pf-insight-style':   'normal',
      '--pf-insight-size':    '1.25rem',
      '--pf-learning-family': "'Geist', system-ui, sans-serif",
      '--pf-learning-style':  'normal',
    },
  },
  {
    id:      'dm-serif',
    name:    'DM Serif',
    preview: 'DM Serif Display',
    desc:    'Elegant and editorial',
    vars: {
      '--pf-title-family':    "'DM Serif Display', Georgia, serif",
      '--pf-title-style':     'italic',
      '--pf-title-weight':    '400',
      '--pf-title-size':      '2.25rem',
      '--pf-insight-family':  "'DM Serif Display', Georgia, serif",
      '--pf-insight-style':   'italic',
      '--pf-insight-size':    '1.5rem',
      '--pf-learning-family': "'DM Serif Display', Georgia, serif",
      '--pf-learning-style':  'italic',
    },
  },
  {
    id:      'playfair',
    name:    'Playfair',
    preview: 'Playfair Display',
    desc:    'Classic and authoritative',
    vars: {
      '--pf-title-family':    "'Playfair Display', Georgia, serif",
      '--pf-title-style':     'normal',
      '--pf-title-weight':    '700',
      '--pf-title-size':      '2rem',
      '--pf-insight-family':  "'Playfair Display', Georgia, serif",
      '--pf-insight-style':   'italic',
      '--pf-insight-size':    '1.375rem',
      '--pf-learning-family': "'Playfair Display', Georgia, serif",
      '--pf-learning-style':  'italic',
    },
  },
  {
    id:      'mono',
    name:    'Monospace',
    preview: 'Geist Mono',
    desc:    'Technical and precise',
    vars: {
      '--pf-title-family':    "'Geist Mono', monospace",
      '--pf-title-style':     'normal',
      '--pf-title-weight':    '400',
      '--pf-title-size':      '1.75rem',
      '--pf-insight-family':  "'Geist Mono', monospace",
      '--pf-insight-style':   'normal',
      '--pf-insight-size':    '1.125rem',
      '--pf-learning-family': "'Geist Mono', monospace",
      '--pf-learning-style':  'normal',
    },
  },
];

export const SECTION_STYLES = [
  {
    id:   'uppercase',
    name: 'UPPERCASE',
    desc: 'Strong, tracked labels',
    vars: {
      '--pf-section-transform':  'uppercase',
      '--pf-section-tracking':   '2.5px',
      '--pf-section-size':       '0.625rem',
      '--pf-section-weight':     '600',
    },
  },
  {
    id:   'lowercase',
    name: 'lowercase',
    desc: 'Quiet, editorial labels',
    vars: {
      '--pf-section-transform':  'none',
      '--pf-section-tracking':   '0px',
      '--pf-section-size':       '0.75rem',
      '--pf-section-weight':     '500',
    },
  },
  {
    id:   'sentence',
    name: 'Sentence case',
    desc: 'Natural, readable labels',
    vars: {
      '--pf-section-transform':  'none',
      '--pf-section-tracking':   '0.3px',
      '--pf-section-size':       '0.6875rem',
      '--pf-section-weight':     '500',
    },
  },
];

export const BODY_SIZES = [
  { id: 'compact',  name: 'Compact',  desc: '12px',  vars: { '--pf-body-size': '0.75rem',    '--pf-opening-size': '0.8125rem' } },
  { id: 'regular',  name: 'Regular',  desc: '13px',  vars: { '--pf-body-size': '0.8125rem',  '--pf-opening-size': '0.875rem'  } },
  { id: 'spacious', name: 'Spacious', desc: '14px',  vars: { '--pf-body-size': '0.875rem',   '--pf-opening-size': '0.9375rem' } },
];

export const LEADINGS = [
  { id: 'tight',   name: 'Tight',   desc: '1.5×',  vars: { '--pf-body-leading': '1.5'  } },
  { id: 'regular', name: 'Regular', desc: '1.8×',  vars: { '--pf-body-leading': '1.8'  } },
  { id: 'airy',    name: 'Airy',    desc: '2.2×',  vars: { '--pf-body-leading': '2.2'  } },
];

export const DEFAULT_PORTFOLIO_DESIGN = {
  displayFont:   'geist',
  sectionStyle:  'uppercase',
  bodySize:      'regular',
  leading:       'regular',
};

// Build a flat CSS-vars object from a design config
export function buildDesignVars(design = DEFAULT_PORTFOLIO_DESIGN) {
  const find = (list, id) => list.find(x => x.id === id);
  const font    = find(DISPLAY_FONTS,   design.displayFont  || 'geist');
  const section = find(SECTION_STYLES,  design.sectionStyle || 'uppercase');
  const size    = find(BODY_SIZES,      design.bodySize     || 'regular');
  const leading = find(LEADINGS,        design.leading      || 'regular');
  return {
    ...(font?.vars    || {}),
    ...(section?.vars || {}),
    ...(size?.vars    || {}),
    ...(leading?.vars || {}),
  };
}
