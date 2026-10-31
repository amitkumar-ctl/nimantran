// Contact form topics (shared by the form and the API; no heavy imports here).
export const CONTACT_TOPICS = ['help', 'rsvp', 'shagun', 'bug', 'feedback', 'privacy', 'other'] as const;
export const CONTACT_TOPIC_LABELS: Record<(typeof CONTACT_TOPICS)[number], string> = {
  help: 'Help with my invite', rsvp: 'Guest replies & guest list', shagun: 'Shagun / UPI', bug: 'Something is broken',
  feedback: 'Idea or feedback', privacy: 'Privacy or delete my data', other: 'Something else',
};
