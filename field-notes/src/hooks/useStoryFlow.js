export function emptyStoryFlow() {
  return {
    human:        { title: '', contextLine: '', situation: '' },
    problem:      { name: '', evidence: '', competitive: '' },
    evidence:     { keyData: '', observation: '', artifactNote: '' },
    turningPoint: { insight: '', rejected: '' },
    role:         { contribution: '', successCriteria: '' },
    decisions:    [{ id: 1, name: '', built: '', rejected: '', impact: '' }],
    outcome:      { changed: '', honest: '' },
    learning:     { text: '' },
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function hasContent(section) {
  if (!section || typeof section !== 'object') return false;
  return Object.values(section).some(v => typeof v === 'string' && v.trim().length > 0);
}

function decisionsHaveContent(decisions) {
  if (!Array.isArray(decisions) || decisions.length === 0) return false;
  return decisions.some(d => d.name && d.name.trim().length > 0);
}

function decisionsHaveComplete(decisions) {
  if (!Array.isArray(decisions) || decisions.length === 0) return false;
  return decisions.some(
    d => d.name?.trim() && d.built?.trim() && d.rejected?.trim() && d.impact?.trim()
  );
}

// ── Completeness ───────────────────────────────────────────────────────────────
//
// Must-have moves (1,2,3,5,6,8): 13% each when any field has content = 78% max
// Recommended moves (4,9):        8% each                              = 16% max
// Nice to have:                   6% when ≥1 decision card fully filled
// Total max: 100%

export function calcFlowCompleteness(sf) {
  if (!sf) return 0;
  let pct = 0;

  // Must-haves
  if (hasContent(sf.human))    pct += 13;
  if (hasContent(sf.problem))  pct += 13;
  if (hasContent(sf.evidence)) pct += 13;
  if (hasContent(sf.role))     pct += 13;
  if (decisionsHaveContent(sf.decisions)) pct += 13;
  if (hasContent(sf.outcome))  pct += 13;

  // Recommended
  if (hasContent(sf.turningPoint)) pct += 8;
  if (hasContent(sf.learning))     pct += 8;

  // Nice to have
  if (decisionsHaveComplete(sf.decisions)) pct += 6;

  return Math.min(100, pct);
}

// ── Mentor messages ────────────────────────────────────────────────────────────
// Returns the single most relevant message given the current flow state.
// Messages replace each other as thresholds are crossed.

export function getMentorMessage(sf) {
  if (!sf) return "Every great portfolio starts with a person suffering. Start there.";

  const h  = hasContent(sf.human);
  const p  = hasContent(sf.problem);
  const e  = hasContent(sf.evidence);
  const tp = hasContent(sf.turningPoint);
  const r  = hasContent(sf.role);
  const d  = decisionsHaveContent(sf.decisions);
  const o  = hasContent(sf.outcome);
  const l  = hasContent(sf.learning);

  if (h && p && e && r && d && o && l) {
    return "Your story is complete. Generate the showcase when you're ready.";
  }
  if (o && !l) {
    return "Almost there. Close with what you learned. One principle. The thing you'd say to a designer starting this project.";
  }
  if (h && p && e && r && d && !o) {
    return "You have a story. Now tell us what actually changed — and be honest about what didn't.";
  }
  if (tp && !r) {
    return "That's your hinge. Everything before it was the setup. Everything after is the argument.";
  }
  if (p && !e) {
    return "Named. Now show the evidence that made it undeniable.";
  }
  if (h && !p) {
    return "Good start. Now give the problem a name sharp enough to diagnose it.";
  }
  return "Every great portfolio starts with a person suffering. Start there.";
}

// ── Section status ─────────────────────────────────────────────────────────────
// Returns 'empty' | 'in-progress' | 'complete' for a given move id + storyFlow.

export function getMoveStatus(moveId, sf) {
  if (!sf) return 'empty';

  if (moveId === 'decisions') {
    if (!decisionsHaveContent(sf.decisions)) return 'empty';
    if (decisionsHaveComplete(sf.decisions)) return 'complete';
    return 'in-progress';
  }

  const section = sf[moveId];
  if (!section) return 'empty';
  if (!hasContent(section)) return 'empty';

  // A section is "complete" if every non-optional field has content.
  const REQUIRED = {
    human:        ['title', 'situation'],
    problem:      ['name', 'evidence'],
    evidence:     ['keyData', 'observation'],
    turningPoint: ['insight'],
    role:         ['contribution'],
    outcome:      ['changed'],
    learning:     ['text'],
  };
  const required = REQUIRED[moveId] || [];
  const allFilled = required.every(f => section[f] && section[f].trim());
  return allFilled ? 'complete' : 'in-progress';
}
