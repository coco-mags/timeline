import React, { useState } from 'react';
import FieldUnit from '../FieldUnit.jsx';
import { FIELD_EXAMPLES, FLOW_TIPS } from '../../../data/flowTips.js';

const MOVE_QUESTION  = "What were the 2 to 5 most important decisions you made — and what did you choose not to do?";
const MOVE_RULE      = "Describe decisions, not features. Each one needs a name, a reason, a rejection, and why it matters for the human — not the product.";
const MENTOR_MESSAGE = "The decisions are there. Now tell us what actually changed — and be honest about what didn't.";
const WHAT_WORKS     = FLOW_TIPS.decisions?.whatWorks;

function emptyCard(id) {
  return { id, name: '', built: '', rejected: '', impact: '' };
}

function isCardComplete(card) {
  return !!(card.name?.trim() && card.built?.trim() && card.rejected?.trim() && card.impact?.trim());
}

export default function MoveDecisions({ data, onChange, moments }) {
  const cards = Array.isArray(data) ? data : [emptyCard(1)];
  const [dragId, setDragId]       = useState(null);
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

  const allComplete = cards.every(isCardComplete);

  const ex = FIELD_EXAMPLES.decisions;

  return (
    <div className="move-editor">
      <p className="move-question">{MOVE_QUESTION}</p>
      {WHAT_WORKS && <p className="move-what-works">{WHAT_WORKS}</p>}

      <div className="move-rule-card">
        <div className="move-rule-label">the rule</div>
        <p className="move-rule-text">{MOVE_RULE}</p>
      </div>

      {allComplete && cards.length >= 2 && (
        <p className="move-mentor-msg">{MENTOR_MESSAGE}</p>
      )}

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
            (card.id === dragId     ? ' dragging'    : '') +
            (card.id === dragOverId ? ' drag-over'   : '') +
            (isCardComplete(card)   ? ' is-complete' : '')
          }
        >
          <div className="flow-decision-card-header">
            <span className="flow-decision-drag">⠿</span>
            <span className="flow-decision-num">Decision {idx + 1}</span>
            {isCardComplete(card) && <span className="flow-decision-complete-dot" />}
            {cards.length > 1 && (
              <button className="flow-decision-remove" onClick={() => removeCard(card.id)}>✕ remove</button>
            )}
          </div>

          <FieldUnit
            label="Decision name"
            value={card.name}
            onChange={val => updateCard(card.id, 'name', val)}
            placeholder="e.g. Make the information visible where the work happens"
            hint="4–6 words that name this decision clearly enough for a stranger to understand"
            examples={ex.name}
            type="input"
            required
          />

          <FieldUnit
            label="What you chose and why"
            value={card.built}
            onChange={val => updateCard(card.id, 'built', val)}
            placeholder="e.g. We put the recipe information at the point of use, not in a separate reference doc."
            hint="Not what you built — why this approach over alternatives"
            examples={ex.built}
            type="textarea"
            rows={3}
            required
            showPull
            moments={moments}
            phaseFilter={null}
            onInsert={text => updateCard(card.id, 'built', card.built ? card.built + '\n\n' + text : text)}
          />

          <div className="flow-decision-not-wrap">
            <FieldUnit
              label={<>What you chose <span className="flow-decision-not-emphasis">NOT</span> to do</>}
              value={card.rejected}
              onChange={val => updateCard(card.id, 'rejected', val)}
              placeholder="e.g. Decided not to add a training session — that would fix the people, not the system."
              hint="The rejection proves judgment — you saw the alternative and chose not to take it"
              examples={ex.rejected}
              type="textarea"
              rows={2}
              required
            />
          </div>

          <FieldUnit
            label="Why it matters — the human impact"
            value={card.impact}
            onChange={val => updateCard(card.id, 'impact', val)}
            placeholder="e.g. Staff no longer have to hold the recipe in memory during a rush. They can focus on the customer."
            hint={card.name && !card.impact ? 'Close with the person, not the feature. "So that [real person] can now…"' : undefined}
            examples={ex.impact}
            type="textarea"
            rows={2}
            required
          />
        </div>
      ))}

      {cards.length < 5 && (
        <button className="flow-decision-add" onClick={addCard}>
          + add another decision
        </button>
      )}
    </div>
  );
}
