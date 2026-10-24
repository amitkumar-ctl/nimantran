import type { TourStep } from './GuidedTour';

/* What each tour says. Targets match data-tour="…" attributes on the pages.
   Steps whose element isn't on the page are skipped automatically (e.g. the
   QR code and sharing steps only appear once an invite is published). */

export const DASHBOARD_TOUR: TourStep[] = [
  {
    title: 'Welcome to Nimantran 🎉',
    body: <>Let’s take a one-minute tour. You’ll have a beautiful invitation website, with RSVP, maps, calendar reminders and shagun, ready to share on WhatsApp in about five minutes.</>,
  },
  { target: 'create-names', title: 'Start with your names', body: <>They appear on the invite in elegant lettering, and in the WhatsApp preview card when you share the link.</> },
  { target: 'create-date', title: 'Pick the wedding date', body: <>Choose today or any day after. It powers the live countdown, and we pre-fill haldi, mehndi, sangeet and the other functions around it. You can change them all later.</> },
  { target: 'create-design', title: 'Choose from thousands of designs', body: <>Search by colour (“red”, “pastel”, “lal”), tradition (“nikah”, “south indian”) or motif (“lotus”, “peacock”). The previews show <b>your</b> names. You can switch designs anytime, even after sharing.</> },
  { target: 'create-submit', title: 'Create your invite', body: <>This opens the editor, where you add venues, maps, RSVP and UPI shagun. Nothing is public until you press Publish.</> },
  { target: 'new-invite', title: 'More than one celebration?', body: <>Create separate invites, for example one for the wedding and one for the reception.</> },
  { target: 'invite-card', title: 'Your invites live here', body: <><b>Edit</b> opens the editor, <b>RSVPs</b> shows who’s coming, and <b>View</b> opens the live invite.</> },
  { target: 'invite-delete', title: 'Made one by mistake?', body: <>Tap the bin to delete an invite. You’ll be asked to confirm first, and live invites warn you that the shared link will stop working.</> },
  { target: 'nav-designs', title: 'Browse designs anytime', body: <>Explore every design with live previews. Tap “Use this design” to start a new invite with it.</> },
  { target: 'tour-replay', title: 'Need a refresher?', body: <>Replay this tour anytime from here. Happy planning! 💐</> },
];

export const EDITOR_TOUR: TourStep[] = [
  {
    title: 'Your invitation editor ✨',
    body: <>Everything you change shows up instantly in the live preview. Your guests see nothing until you press <b>Publish</b>. Here’s a quick look around.</>,
  },
  { target: 'ed-couple', tab: 'edit', title: 'Names, blessing & message', body: <>Change the top line (e.g. “॥ शुभ विवाह ॥”, “Nikah Mubarak”) and the invitation message to match your family’s style.</> },
  { target: 'ed-day', tab: 'edit', title: 'Date, muhurat & venue', body: <>The muhurat time drives the live countdown guests see. Dates start from today, so past days can’t be picked by mistake.</> },
  { target: 'ed-design', tab: 'edit', title: 'Switch designs anytime', body: <>Search thousands of designs and tap one to try it on your invite. You can even change it after sharing; the link stays the same.</> },
  { target: 'ed-functions', tab: 'edit', title: 'Every function, in order', body: <>Add haldi, mehndi, sangeet, wedding and reception, each with its own date, time, venue and Google Maps link. Write times like “7:30 PM” so guests’ calendars get the exact time.</> },
  { target: 'ed-rsvp', tab: 'edit', title: 'RSVP & UPI shagun', body: <>Set an RSVP-by date (on or before the wedding), and add your UPI ID so relatives can send shagun from any UPI app with one tap.</> },
  { target: 'ed-preview', tab: 'preview', title: 'Live preview', body: <>This is exactly what guests will see on their phones. Scroll it to check every section.</> },
  { target: 'ed-calendar', tab: 'preview', title: 'Guests can save your dates', body: <>Every function has a <b>Calendar</b> button, plus <b>Save all dates</b>. Guests add your functions to Google Calendar, iPhone or Outlook, with a reminder the day before.</> },
  { target: 'ed-save', title: 'Save your draft', body: <>Saves your changes without publishing, so you can come back anytime.</> },
  { target: 'ed-publish', title: 'Publish when you’re ready', body: <>Publishing makes your link live. You’ll then get <b>Copy link</b>, <b>WhatsApp</b> and <b>QR code</b> buttons.</> },
  { target: 'ed-share', title: 'Share on WhatsApp', body: <>Send the link to family groups. WhatsApp shows a preview card with your names and date.</> },
  { target: 'ed-qr', title: 'QR code for printed cards', body: <>Printing cards too? Download a ready-made QR card, or the QR alone for your printer. Guests scan it to open your invite, see the venues and RSVP, and they always see your latest changes.</> },
  { target: 'ed-guests', title: 'Guests & shagun', body: <>See how many people are coming, headcount per function and messages, plus your <b>shagun register</b>: totals, guests’ “I’ve sent shagun” reports to check, and cash envelopes you record.</> },
  { target: 'ed-delete', tab: 'edit', title: 'Delete if you need to', body: <>Created this invite by mistake? Delete it here. It asks you to confirm first, and removes the invite and its RSVPs for good.</> },
  { target: 'tour-replay', title: 'That’s it! 🎊', body: <>Replay this tour anytime from here. Now make it yours!</> },
];
