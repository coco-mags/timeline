// The 9-move storytelling spine. Move 7 is embedded inside Move 6 (decisions)
// so there are 8 rendered sections. Numbers follow the original 9-move framing.

export const FLOW_MOVES = [
  {
    id: 'human',
    number: 1,
    name: 'The human',
    priority: 'must-have',
    guidanceQuestion: 'Who is the real person suffering here? What does their day look like before your work exists?',
    rule: "Never start with 'I was tasked with...' — start with the person who has the problem.",
    pullPhases: ['observe'],
  },
  {
    id: 'problem',
    number: 2,
    name: 'The problem',
    priority: 'must-have',
    guidanceQuestion: 'What is the real name of this problem — sharp enough that someone would recognise it immediately?',
    rule: "A named problem is a diagnosed problem. 'The Fragmentation' is unforgettable. 'We identified several issues' is not.",
    pullPhases: ['observe'],
  },
  {
    id: 'role',
    number: 3,
    name: 'Your role',
    priority: 'must-have',
    guidanceQuestion: 'What did YOU specifically own, decide, or advocate for — and what did done look like?',
    rule: "Active verbs show agency. 'I decided' is stronger than 'I was responsible for.' Your success criteria show you designed with a destination.",
    pullPhases: [],
  },
  {
    id: 'evidence',
    number: 4,
    name: 'The evidence',
    priority: 'must-have',
    guidanceQuestion: 'What can you show — not just say — that proves this problem was real and worth solving?',
    rule: "Numbers if you have them. Observations if you don't. Photos, sketches, or competitive maps if you captured them. Specificity is credibility.",
    pullPhases: ['observe', 'define'],
  },
  {
    id: 'turningPoint',
    number: 5,
    name: 'The turning point',
    priority: 'recommended',
    guidanceQuestion: "What did you suddenly understand that you couldn't unsee? One or two sentences — no hedging.",
    rule: "This is the most memorable moment in any great portfolio. Write it like the moment it felt obvious.",
    pullPhases: ['define', 'ideate'],
  },
  {
    id: 'decisions',
    number: 7,
    name: 'The decisions',
    priority: 'must-have',
    guidanceQuestion: 'What are the 2–5 most important decisions you made? Name each one. Show what you chose not to do.',
    rule: "Describe decisions, not features. Each one needs a name, a reason, a rejection, and why it matters for the human — not the product.",
    pullPhases: ['all'],
  },
  {
    id: 'outcome',
    number: 8,
    name: 'The outcome',
    priority: 'must-have',
    guidanceQuestion: "What actually changed? And what is the honest part — what didn't ship, what was harder, what failed?",
    rule: "You don't need a dashboard. 'Nobody needed reminding after day 3' is a real outcome. The honest part makes you trusted. Never skip it.",
    pullPhases: ['launch', 'reflect'],
  },
  {
    id: 'learning',
    number: 9,
    name: 'The learning',
    priority: 'recommended',
    guidanceQuestion: "What do you now understand that you didn't before? Write it like a principle — something you'd say to a designer starting this kind of project.",
    rule: "Short enough to remember. Specific enough to be yours. Honest enough to be useful.",
    pullPhases: [],
  },
];

export const MOVE_BY_ID = Object.fromEntries(FLOW_MOVES.map(m => [m.id, m]));
