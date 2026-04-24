import React, { useState } from 'react';

function emptyCard() {
  return { id: Date.now(), name: '', built: '', rejected: '', impact: '' };
}

export default function ProcessSection({ data, onChange }) {
  // support both old array format and new { cards, notes } object format
  const isLegacy = Array.isArray(data);
  const cards = isLegacy ? data : (data.cards || [{ id: 1, name: '', built: '', rejected: '', impact: '' }]);

  const [dragId,     setDragId]     = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  const updateCards = (newCards) => {
    if (isLegacy) onChange(newCards);
    else onChange({ ...data, cards: newCards });
  };

  const updateCard = (id, field, val) =>
    updateCards(cards.map(c => c.id === id ? { ...c, [field]: val } : c));

  const addCard = () => updateCards([...cards, emptyCard()]);

  const deleteCard = (id) => {
    if (cards.length <= 1) return;
    updateCards(cards.filter(c => c.id !== id));
  };

  const handleDrop = (toId) => {
    if (!dragId || dragId === toId) return;
    const from = cards.findIndex(c => c.id === dragId);
    const to   = cards.findIndex(c => c.id === toId);
    const next = [...cards];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    updateCards(next);
    setDragId(null);
    setDragOverId(null);
  };

  return (
    <div className="story-section-fields">
      <p className="story-field-helper">Each card = one design decision or sprint. Drag to reorder.</p>
      {cards.map(card => (
        <div
          key={card.id}
          draggable
          onDragStart={e => { setDragId(card.id); e.dataTransfer.setData('card-id', card.id.toString()); }}
          onDragEnter={() => { if (card.id !== dragId) setDragOverId(card.id); }}
          onDragOver={e => e.preventDefault()}
          onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget)) setDragOverId(null); }}
          onDrop={e => { e.preventDefault(); handleDrop(card.id); }}
          onDragEnd={() => { setDragId(null); setDragOverId(null); }}
          className={
            'process-card' +
            (card.id === dragId     ? ' dragging'  : '') +
            (card.id === dragOverId ? ' drag-over' : '')
          }
        >
          <div className="process-card-header">
            <span className="process-card-drag-handle">⠿</span>
            <input
              className="process-card-name"
              value={card.name}
              onChange={e => updateCard(card.id, 'name', e.target.value)}
              placeholder="Decision or sprint name"
            />
            {cards.length > 1 && (
              <button className="process-card-delete" onClick={() => deleteCard(card.id)} title="Remove">✕</button>
            )}
          </div>
          <div className="process-card-fields">
            <label className="story-field-label story-field-label--sm">What you built or decided
              <textarea className="story-field-textarea story-field-textarea--sm" value={card.built}
                onChange={e => updateCard(card.id, 'built', e.target.value)}
                placeholder="Describe the solution or choice" rows={2} />
            </label>
            <label className="story-field-label story-field-label--sm">What you rejected
              <textarea className="story-field-textarea story-field-textarea--sm" value={card.rejected}
                onChange={e => updateCard(card.id, 'rejected', e.target.value)}
                placeholder="What alternative did you rule out?" rows={2} />
            </label>
            <label className="story-field-label story-field-label--sm">Why it mattered
              <textarea className="story-field-textarea story-field-textarea--sm" value={card.impact}
                onChange={e => updateCard(card.id, 'impact', e.target.value)}
                placeholder="What changed because of this decision?" rows={2} />
            </label>
          </div>
        </div>
      ))}
      <button className="process-card-add" onClick={addCard}>+ add decision</button>
    </div>
  );
}
