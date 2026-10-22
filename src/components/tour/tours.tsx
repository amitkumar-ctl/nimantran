import type { TourStep } from './GuidedTour';

/* What each tour says. Targets match data-tour="…" attributes on the pages. */

export const DASHBOARD_TOUR: TourStep[] = [
  {
    title: 'Welcome to Nimantran 🎉',
    body: <>Let’s take a one-minute tour. You’ll have a beautiful invitation website, with RSVP and shagun, ready to share on WhatsApp in about five minutes.</>,
  },
  { target: 'create-names', title: 'Start with your names', body: <>They appear on the invite in elegant lettering, and in the WhatsApp preview card when you share the link.</> },
  { target: 'create-date', title: 'Pick the wedding date', body: <>It powers the live countdown on your invite. We also pre-fill haldi, mehndi, sangeet and the other functions around this date. You can change them all later.</> },
  { target: 'create-design', title: 'Choose from thousands of designs', body: <>Search by colour (“red”, “pastel”, “lal”), tradition (“nikah”, “south indian”) or motif (“lotus”, “peacock”). The previews show <b>your</b> names. You can switch designs anytime, even after sharing.</> },
  { target: 'create-submit', title: 'Create your invite', body: <>This opens the editor, where you add venues, maps, RSVP and UPI shagun. Nothing is public until you press Publish.</> },
  { target: 'new-invite', title: 'More than one celebration?', body: <>Create separate invites, for example one for the wedding and one for the reception.</> },
  { target: 'invite-card', title: 'Your invites live here', body: <><b>Edit</b> opens the editor, <b>RSVPs</b> shows who’s coming, and <b>View</b> opens the live invite.</> },
  { target: 'nav-designs', title: 'Browse designs anytime', body: <>Explore every design with live previews. Tap “Use this design” to start a new invite with it.</> },
  { target: 'tour-replay', title: 'Need a refresher?', body: <>Replay this tour anytime from here. Happy planning! 💐</> },
];

export const EDITOR_TOUR: TourStep[] = [
  {
    title: 'Your invitation editor ✨',
    body: <>Everything you change shows up instantly in the live preview. Your guests see nothing until you press <b>Publish</b>. Here’s a quick look around.</>,
  },
  { target: 'ed-couple', tab: 'edit', title: 'Names, blessing & message', body: <>Change the top line (e.g. “॥ शुभ विवाह ॥”, “Nikah Mubarak”) and the invitation message to match your family’s style.</> },
  { target: 'ed-day', tab: 'edit', title: 'Date, muhurat & venue', body: <>The muhurat time drives the live countdown guests see. The main venue appears right under your names.</> },
  { target: 'ed-design', tab: 'edit', title: 'Switch designs anytime', body: <>Search thousands of designs and tap one to try it on your invite. You can even change it after sharing; the link stays the same.</> },
  { target: 'ed-functions', tab: 'edit', title: 'Every function, in order', body: <>Add haldi, mehndi, sangeet, wedding and reception, each with its own date, time, venue and Google Maps link. Use the arrows to reorder.</> },
  { target: 'ed-rsvp', tab: 'edit', title: 'RSVP & UPI shagun', body: <>Set an RSVP-by date, and add your UPI ID so relatives can send shagun from any UPI app with one tap.</> },
  { target: 'ed-preview', tab: 'preview', title: 'Live preview', body: <>This is exactly what guests will see on their phones. Scroll it to check every section.</> },
  { target: 'ed-save', title: 'Save your draft', body: <>Saves your changes without publishing, so you can come back anytime.</> },
  { target: 'ed-publish', title: 'Publish when you’re ready', body: <>Publishing makes your link live. You’ll then get <b>Copy link</b> and <b>WhatsApp</b> buttons to share it in one message.</> },
  { target: 'ed-share', title: 'Share on WhatsApp', body: <>Send the link to family groups. WhatsApp shows a preview card with your names and date.</> },
  { target: 'ed-guests', title: 'Track RSVPs', body: <>See who’s coming, headcount per function, dietary needs and messages. Download the list for your caterer.</> },
  { target: 'tour-replay', title: 'That’s it! 🎊', body: <>Replay this tour anytime from here. Now make it yours!</> },
];
