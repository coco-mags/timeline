// Static right-panel content per move.
// Portfolio names and colors are fixed: Anna (#fac775 / #faeeda), Bruno (#9fe1cb / #e1f5ee), Tony (#afa9ec / #eeedfe)

// ── Per-field examples for the focused-state example panel inside each move editor ──
// Used by FieldUnit via each move component. Colors: Anna #fac775, Bruno #9fe1cb, Tony #afa9ec.

export const FIELD_EXAMPLES = {
  human: {
    title: [
      { color: '#fac775', text: 'GSC Insights: The Performance Workflow We Stopped Pretending Didn\'t Exist' },
      { color: '#9fe1cb', text: 'Animal Planet Pets: A Super App Experience for Pet Care' },
      { color: '#afa9ec', text: 'Eatxplore: Ordering Without the Embarrassment' },
    ],
    contextLine: [
      { color: '#fac775', text: 'Semrush · B2B SaaS · 2024 · Senior product designer' },
      { color: '#9fe1cb', text: 'Discovery Brasil · Super app · 2020 · Lead UX' },
      { color: '#afa9ec', text: 'Georgia Tech · Student project · 2018 · UX lead' },
    ],
    situation: [
      { color: '#fac775', text: 'Users connected GSC to Semrush then went right back to the native console for real analysis. The integration existed but it wasn\'t changing behaviour.' },
      { color: '#9fe1cb', text: 'The digital experience for pet owners was extremely fragmented — one app for vaccines, another for pet-friendly locations, another for content, another for appointments.' },
      { color: '#afa9ec', text: 'International students feel embarrassed and frustrated visiting ethnic restaurants. Even common terms sound foreign. Many avoid these restaurants entirely — even when invited.' },
    ],
  },
  problem: {
    name: [
      { color: '#fac775', text: 'The Copycat Trap' },
      { color: '#9fe1cb', text: 'The Fragmentation' },
      { color: '#afa9ec', text: 'The Confidence Gap' },
    ],
    evidence: [
      { color: '#fac775', text: 'Every competitor had copied the GSC interface and imported its friction. None of them asked why users struggled — they just rebuilt the struggle in a new wrapper.' },
      { color: '#9fe1cb', text: '36% of pet owners made impulse purchases. 52% had difficulty travelling with pets. Over 30% participated in online communities — but none helped them take action.' },
      { color: '#afa9ec', text: '10 interviews, users ranging from 4 months to 5 years in the US. Even long-term residents still Googled dish names one by one. The problem didn\'t go away with time.' },
    ],
    competitive: [
      { color: '#fac775', text: 'They treated the problem as a data problem. It was a workflow problem. Importing the same broken flow into a new UI just relocates the suffering.' },
      { color: '#9fe1cb', text: 'Existing apps focused on sales, not care. The pet owner journey had no guidance — just transactions.' },
      { color: '#afa9ec', text: 'Translation apps gave words. They didn\'t give confidence. Knowing what \'quesadilla\' means doesn\'t help you order one without flinching.' },
    ],
  },
  evidence: {
    keyData: [
      { color: '#fac775', text: 'Users who connected GSC went back to native console within the same session — 0 workflow change despite 100% integration completion' },
      { color: '#9fe1cb', text: 'Brazil: 2nd largest pet market globally · 50% of the audience were pet owners · 6 fragmented apps covering the same user need' },
      { color: '#afa9ec', text: '10 interviews · 100% still struggled after 5 years in the US · 0 existing apps combined recommendations with cultural context' },
    ],
    observation: [
      { color: '#fac775', text: 'I watched how UX analysts actually used GSC tools during a day of user sessions. They opened the integration, looked at the data, then opened a new tab to native GSC. Every single time.' },
      { color: '#9fe1cb', text: 'I mapped the complete pet owner journey and found 23 distinct moments of need. Only 4 were being met by existing apps — and none were the moments that mattered most.' },
      { color: '#afa9ec', text: 'In my interviews I let users role-play ordering at a Mexican restaurant. Three out of ten people physically looked away when trying to pronounce the dish names. That told me more than any survey.' },
    ],
    artifactNote: [
      { color: '#fac775', text: 'Session recordings showing the tab-switching pattern · Competitive audit grid' },
      { color: '#9fe1cb', text: 'Journey map covering 23 need moments · Market data slide' },
      { color: '#afa9ec', text: 'Affinity map from 10 interviews · Role-play session video clips' },
    ],
  },
  turningPoint: {
    insight: [
      { color: '#fac775', text: 'We weren\'t building another GSC dashboard. We were building the workflow GSC never prioritised. Not a reskin. A fix for something GSC chose to ignore.' },
      { color: '#9fe1cb', text: 'Brazilians don\'t treat pets as possessions — they treat them as family members. The entire product strategy shifted when we understood that trusted information, not convenience features, was the decisive factor.' },
      { color: '#afa9ec', text: 'The goal wasn\'t to help people translate menus. It was to help them feel confident enough to walk into a restaurant and stay. Everything we\'d been building was solving the wrong problem.' },
    ],
    rejected: [
      { color: '#fac775', text: 'We chose not to copy the GSC interface even though it would have been the fastest path to delivery. A familiar broken thing is still a broken thing.' },
      { color: '#9fe1cb', text: 'We chose not to build a shopping-first experience. Every competitor had gone that route. It meant optimising for the transaction, not the relationship.' },
      { color: '#afa9ec', text: 'We removed the in-app ordering feature entirely. It would have made users stand out at the table — the opposite of what we were building toward.' },
    ],
  },
  role: {
    contribution: [
      { color: '#fac775', text: 'I owned the entire product logic — from naming the problem to designing the Shift Method. I pushed to abandon the copycat approach when the team defaulted to it.' },
      { color: '#9fe1cb', text: 'I facilitated the discovery process, mapped the complete pet owner journey, built the product vision, defined key flows, and ran experiments with Discovery\'s audience.' },
      { color: '#afa9ec', text: 'I advocated for user research before anyone started designing. I led every interview, synthesis session, and design iteration. After the group project ended, I kept going on my own.' },
    ],
    successCriteria: [
      { color: '#fac775', text: 'Users would connect GSC and not need to leave. The integration would become where real analysis happened — not just where data was displayed.' },
      { color: '#9fe1cb', text: 'A clear, scalable, data-oriented model that could prove product-market fit and advance to MVP. Not a feature list — a validated hypothesis.' },
      { color: '#afa9ec', text: 'Users would feel confident enough to order without Googling. They would walk into the restaurant and stay. That was the only measure that mattered.' },
    ],
  },
  decisions: {
    name: [
      { color: '#fac775', text: 'Make context visible where the work already happens' },
      { color: '#9fe1cb', text: 'Build around trust, not transactions' },
      { color: '#afa9ec', text: 'Remove anything that makes users stand out' },
    ],
    built: [
      { color: '#fac775', text: 'We embedded GSC data directly inside the workflow panels users were already in. Not a separate tab, not a linked report — right there, at the moment of decision.' },
      { color: '#9fe1cb', text: 'We built the content pillar around trusted, expert-verified information rather than user-generated content. Pet owners in Brazil make decisions based on trust, not volume.' },
      { color: '#afa9ec', text: 'We redesigned the entire recommendation system around cultural familiarity — what dishes from your background does this new cuisine resemble?' },
    ],
    rejected: [
      { color: '#fac775', text: 'We chose not to build a dedicated analytics dashboard. Dashboards ask users to come to the data. We wanted the data to come to the user.' },
      { color: '#9fe1cb', text: 'We chose not to launch a marketplace. A marketplace optimises for supply. We were optimising for care.' },
      { color: '#afa9ec', text: 'We chose not to add in-app ordering. Every test showed it made users more self-conscious, not less.' },
    ],
    impact: [
      { color: '#fac775', text: 'An analyst running a competitor audit no longer has to hold two browser tabs in their head. The context is already there. They can think about the insight, not the interface.' },
      { color: '#9fe1cb', text: 'A pet owner searching for a vet recommendation gets expert-vetted information, not the highest-bidding clinic. That difference is the entire value proposition.' },
      { color: '#afa9ec', text: 'A student can sit down at a Mexican restaurant with their American classmates and order without apologising. That moment is the whole point.' },
    ],
  },
  outcome: {
    changed: [
      { color: '#fac775', text: 'Users who connected GSC showed stronger activation and retention metrics. The integration became one of the top-cited reasons for staying subscribed in post-onboarding surveys.' },
      { color: '#9fe1cb', text: 'The project advanced to MVP with a clear, scalable, data-oriented model. Research revealed strong signals across all five product hypotheses.' },
      { color: '#afa9ec', text: 'In usability testing, task completion improved across all user types. Users reported feeling more confident. Two users said they had already tried visiting an ethnic restaurant after the prototype session.' },
    ],
    honest: [
      { color: '#fac775', text: 'The Shift Method required significant data infrastructure investment that we underestimated. The first three months felt slow. Some stakeholders questioned whether the complexity was worth it.' },
      { color: '#9fe1cb', text: 'The project was not officially launched due to internal restructuring at Discovery Brasil and overlap with a similar project in Mexico. The vision remains an open opportunity — but it didn\'t ship.' },
      { color: '#afa9ec', text: 'The recommendation algorithm we actually shipped was a simplified proxy — ethnicity-based rather than taste-based. It worked, but it wasn\'t the elegant solution we\'d originally envisioned.' },
    ],
  },
  learning: {
    text: [
      { color: '#fac775', text: 'Data that misleads is worse than no data. A chart that looks authoritative but reflects stale context destroys trust faster than having no chart at all.' },
      { color: '#9fe1cb', text: 'The vision of a super app unifying health, care, leisure, and benefits for pet owners remains a genuine open opportunity. The timing was wrong. The idea was not.' },
      { color: '#afa9ec', text: 'Empower first. Translate second. Never build something that makes someone dependent on your tool. Build something that makes them need it less.' },
    ],
  },
};

export const FLOW_TIPS = {
  human: {
    examples: [
      {
        name: 'Anna',
        textColor: '#c47b00',
        bgColor: '#faeeda',
        text: 'Users connected GSC then went back to the native console for real work. The product wasn\'t keeping them.',
      },
      {
        name: 'Bruno',
        textColor: '#1a7a57',
        bgColor: '#e1f5ee',
        text: '50% of the national audience had pets. Brazil was already the 2nd largest pet market in the world.',
      },
      {
        name: 'Tony',
        textColor: '#5246a8',
        bgColor: '#eeedfe',
        text: 'International students feel embarrassed and frustrated visiting ethnic restaurants.',
      },
    ],
    whatWorks: 'A hero image of the real environment, or a short description of one specific person\'s experience',
  },
  problem: {
    examples: [
      {
        name: 'Anna',
        textColor: '#c47b00',
        bgColor: '#faeeda',
        text: 'The Copycat Trap — most competitors weren\'t solving GSC pain. They were repackaging it.',
      },
      {
        name: 'Bruno',
        textColor: '#1a7a57',
        bgColor: '#e1f5ee',
        text: 'The Fragmentation — one app for vaccines, another for locations, another for content, another for appointments.',
      },
      {
        name: 'Tony',
        textColor: '#5246a8',
        bgColor: '#eeedfe',
        text: 'The Embarrassment Problem — not a language barrier, a confidence barrier.',
      },
    ],
    whatWorks: 'Competitive audit · fragmentation map · photo of the broken real experience',
  },
  evidence: {
    examples: [
      {
        name: 'Anna',
        textColor: '#c47b00',
        bgColor: '#faeeda',
        text: 'Competitive scan showing all tools imported the same friction instead of solving it.',
      },
      {
        name: 'Bruno',
        textColor: '#1a7a57',
        bgColor: '#e1f5ee',
        text: 'Market data — 36% made impulse purchases, 52% had difficulty travelling with pets.',
      },
      {
        name: 'Tony',
        textColor: '#5246a8',
        bgColor: '#eeedfe',
        text: 'Affinity map from 10 user interviews. Engineers attended the synthesis session.',
      },
    ],
    whatWorks: 'A photo of the real situation · a sketch of the current broken flow · a direct quote from someone affected',
  },
  turningPoint: {
    examples: [
      {
        name: 'Anna',
        textColor: '#c47b00',
        bgColor: '#faeeda',
        text: 'We weren\'t building another GSC dashboard. We were building the workflow GSC never prioritised. Not a reskin. A fix.',
      },
      {
        name: 'Bruno',
        textColor: '#1a7a57',
        bgColor: '#e1f5ee',
        text: 'Key insight: Brazilians treat pets as family members. Trusted information was the decisive factor — not products.',
      },
      {
        name: 'Tony',
        textColor: '#5246a8',
        bgColor: '#eeedfe',
        text: 'The goal isn\'t translation. It\'s confidence. We removed the ordering function because it contradicted our core goal.',
      },
    ],
    whatWorks: 'A single bold pull quote, large and isolated on the page. No other content around it.',
  },
  role: {
    examples: [
      {
        name: 'Anna',
        textColor: '#c47b00',
        bgColor: '#faeeda',
        text: 'I owned the entire product logic: from debunking the copycat strategy to designing the Shift Method.',
      },
      {
        name: 'Bruno',
        textColor: '#1a7a57',
        bgColor: '#e1f5ee',
        text: 'Invited to facilitate design and discovery processes, map the complete journey, and define key flows.',
      },
      {
        name: 'Tony',
        textColor: '#5246a8',
        bgColor: '#eeedfe',
        text: 'I advocated for conducting user interviews. I led all research and design activities. I refined the design after the group project ended.',
      },
    ],
    whatWorks: 'A simple diagram showing your position in the team or process — not a job description',
  },
  decisions: {
    examples: [
      {
        name: 'Anna',
        textColor: '#c47b00',
        bgColor: '#faeeda',
        text: 'Bet 2: No Split Reality, Ever — if the dataset changes, everything reflects it. Filters update table AND chart.',
      },
      {
        name: 'Bruno',
        textColor: '#1a7a57',
        bgColor: '#e1f5ee',
        text: 'Four product pillars emerged: care, routine, content, and benefits — not just shopping.',
      },
      {
        name: 'Tony',
        textColor: '#5246a8',
        bgColor: '#eeedfe',
        text: 'We got rid of the ordering function. It made users stand out. That contradicted everything we were building toward.',
      },
    ],
    whatWorks: 'Before/after comparison · annotated sketch · logic flow · direct quote from a user or colleague',
  },
  outcome: {
    examples: [
      {
        name: 'Anna',
        textColor: '#c47b00',
        bgColor: '#faeeda',
        text: 'Turned a passive data integration into a retention driver for 50,000+ URLs.',
      },
      {
        name: 'Bruno',
        textColor: '#1a7a57',
        bgColor: '#e1f5ee',
        text: 'Not officially launched due to internal restructuring. The vision of a super app remains an open opportunity.',
      },
      {
        name: 'Tony',
        textColor: '#5246a8',
        bgColor: '#eeedfe',
        text: 'Task completion improved across all user types. Users felt more confident ordering in front of others.',
      },
    ],
    whatWorks: 'One specific before/after signal. Even qualitative: a quote from your boss or a colleague who noticed.',
  },
  learning: {
    examples: [
      {
        name: 'Anna',
        textColor: '#c47b00',
        bgColor: '#faeeda',
        text: 'Data that misleads is worse than no data.',
      },
      {
        name: 'Bruno',
        textColor: '#1a7a57',
        bgColor: '#e1f5ee',
        text: 'The vision of a unified platform remains valid — the opportunity is still open.',
      },
      {
        name: 'Tony',
        textColor: '#5246a8',
        bgColor: '#eeedfe',
        text: 'Empower first. Translate second. Never make someone dependent on your tool.',
      },
    ],
    whatWorks: 'Display this section visually apart from everything else — large italic serif, dark background',
  },
};
