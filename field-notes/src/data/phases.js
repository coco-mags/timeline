export const PHASES = [
  { id: 'observe', label: 'Observe', color: '#7b9cc4' },
  { id: 'define',  label: 'Define',  color: '#b88fc2' },
  { id: 'ideate',  label: 'Ideate',  color: '#8aab7e' },
  { id: 'test',    label: 'Test',    color: '#d4856a' },
  { id: 'launch',  label: 'Launch',  color: '#9c8060' },
  { id: 'reflect', label: 'Reflect', color: '#9c9890' },
];

export function phaseColor(phaseId) {
  const p = PHASES.find(p => p.id === phaseId);
  return p ? p.color : '#9c9890';
}

export function phaseLabel(phaseId) {
  const p = PHASES.find(p => p.id === phaseId);
  return p ? p.label : phaseId;
}
