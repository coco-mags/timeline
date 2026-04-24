import React, { useState } from 'react';
import PullFromMoments from '../PullFromMoments.jsx';

function emptyCard(id) {
  return { id, name: '', built: '', rejected: '', impact: '' };
}

function isCardComplete(card) {
  return card.name?.trim() && card.built?.trim() && card.rejected?.trim() && card.impact?.trim();
}

export default function MoveDecisions({ data, onChange, moments }) {
  const cards = Array.isArray(data) ? data : [emptyCard(1)];
  const [dragId, setDragId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  const updateCard = (id, field, val) =>
    onChange(cards.map(c => c.id === id ? { ...c, [field]: val } : c));

  const addCard = () => {
    if (cards.length >= 5) return;
    onChange([...cards, emptyCard(Date.now())]);
  };

  const removeCard = (id) => {
    if (cards.length <= 1) return;
    onChange(cards.filter(c => c.id !== id));
  };

  const handleDrop = (toId) => {
    if (!dragId || dragId === toId) return;
    const from = cards.findIndex(c => c.id === dragId);
    const to   = cards.findIndex(c => c.id === toId);
    const next = [...cards];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
    setDragId(null);
    setDragOverId(null);
  };

  return (
    <div className="flow-fields">
      {cards.map((card, idx) => (
        <div
          key={card.id}
          draggable
          onDragStart={e => { setDragId(card.id); e.dataTransfer.setData('card-id', String(card.id)); }}
          onDragEnter={() => { if (card.id !== dragId) setDragOverId(card.id); }}
          onDragOver={e => e.preventDefault()}
          onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget)) setDragOverId(null); }}
          onDrop={e => { e.preventDefault(); handleDrop(card.id); }}
          onDragEnd={() => { setDragId(null); setDragOverId(null); }}
          className={
            'flow-decision-card' +
            (card.id === dragId     ? ' dragging'   : '') +
            (card.id === dragOverId ? ' drag-over'  : '') +
            (isCardComplete(card)   ? ' is-complete' : '')
          }
        >
          <div className="flow-decision-card-header">
            <span className="flow-decision-drag">⠿</span>
            <span className="flow-decision-num">Decision {idx + 1}</span>
            {isCardComplete(card) && <span className="flow-decision-complete-dot" />}
            {cards.length > 1 && (
              <button className="flow-decision-remove" onClick={() => removeCard(card.id)}>✕</button>
            )}
          </div>

          <div className="flow-field-group">
            <label className="flow-field-label">Decision name</label>
            <p className="flow-field-sublabel">Give this decision a name — 4–6 words that would make sense to a stranger</p>
            <input
              className="flow-field-input"
              value={card.name}
              onChange={e => updateCard(card.id, 'name', e.target.value)}
              placeholder="e.g. Make the information visible where the work happens"
            />
          </div>

          <div className="flow-field-group">
            <label className="flow-field-label">What you chose and why</label>
            <p className="flow-field-sublabel">Not what you built — why this approach over alternatives</p>
            <textarea
              className="flow-field-textarea"
              style={{ minHeight: '65px' }}
              value={card.built}
              onChange={e => updateCard(card.id, 'built', e.target.value)}
              placeholder="e.g. We put the recipe information at the point of use, not in a separate reference doc."
            />
            <PullFromMoments
              moments={moments}
              phaseFilter={null}
              onInsert={text => updateCard(card.id, 'built', card.built ? card.built + '\n\n' + text : text)}
            />
          </div>

          <div className="flow-field-group">
            <label className="flow-field-label">What you chose not to do</label>
            <input
              className="flow-field-input"
              value={card.rejected}
              onChange={e => updateCard(card.id, 'rejected', e.target.value)}
              placeholder="e.g. Decided not to add a training session — that would fix the people, not the system."
            />
          </div>

          <div className="flow-field-group">
            <label className="flow-field-label">Why it matters — the human impact</label>
            <p className="flow-field-sublabel">Close with the person, not the feature. "So that [real person] can now…"</p>
            <textarea
              className="flow-field-textarea"
              style={{ minHeight: '55px' }}
              value={card.impact}
              onChange={e => updateCard(card.id, 'impact', e.target.value)}
              placeholder="e.g. Staff no longer have to hold the recipe in memory during a rush. They can focus on the customer."
            />
            {card.impact === '' && card.name !== '' && (
              <p className="flow-field-nudge">What does this mean for the real person using this?</p>
            )}
          </div>
        </div>
      ))}

      {cards.length < 5 && (
        <button className="flow-decision-add" onClick={addCard}>
          + Add another decision
        </button>
      )}
    </div>
  );
}
