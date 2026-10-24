import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/config/site';
import { H2, LegalPage } from '@/components/marketing/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${site.name} collects, uses and protects information about couples and their wedding guests.`,
  alternates: { canonical: '/privacy' },
};

const SECTIONS = [
  { id: 'who', title: 'Who we are' },
  { id: 'collect', title: 'What we collect' },
  { id: 'use', title: 'How we use it' },
  { id: 'guests', title: 'Guests’ information' },
  { id: 'share', title: 'Who we share it with' },
  { id: 'cookies', title: 'Cookies & browser storage' },
  { id: 'payments', title: 'Shagun & payments' },
  { id: 'keep', title: 'How long we keep it' },
  { id: 'security', title: 'Security' },
  { id: 'rights', title: 'Your rights' },
  { id: 'children', title: 'Children' },
  { id: 'changes', title: 'Changes to this policy' },
  { id: 'contact', title: 'Contact & grievance officer' },
];

export default function PrivacyPage() {
  const mail = <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>;
  return (
    <LegalPage title="Privacy Policy" sections={SECTIONS} intro={
      <p>{site.name} helps couples make wedding invitation websites and collect RSVPs. This policy explains what information we collect from couples (“hosts”) and their guests, why, and the choices you have. It is written for India and follows the Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000. In short: we only collect what the invitation needs, we never sell it, and we never handle your money.</p>
    }>
      <H2 id="who">1. Who we are</H2>
      <p>{site.name} ({site.url.replace(/^https?:\/\//, '')}){site.legal.operator !== site.name && <> is operated by {site.legal.operator}</>} (“we”, “us”). For anything about your data, write to {mail} or use our <Link href="/contact">contact form</Link>.</p>

      <H2 id="collect">2. What we collect</H2>
      <h3>From hosts (people who create invitations)</h3>
      <ul>
        <li><b>Account details:</b> your name and email. If you sign up with a password, we store only a one-way hash of it (bcrypt), never the password itself. If you use Google sign-in, we receive your name, email, Google account ID and profile picture link from Google.</li>
        <li><b>Invitation content:</b> what you type into an invite: names, blessing and message, dates, times, venues and map links, functions, RSVP deadline, and your UPI ID and payee name if you add the shagun feature.</li>
        <li><b>Shagun register:</b> entries you add or confirm (guest name, amount, method, note).</li>
      </ul>
      <h3>From guests (people who open an invitation)</h3>
      <ul>
        <li><b>RSVP:</b> name, phone number (optional), whether you are attending, how many people, which functions, dietary notes and a message to the couple.</li>
        <li><b>Shagun report (optional):</b> your name, the amount you say you sent, how you sent it, and a note.</li>
      </ul>
      <h3>From anyone who contacts us</h3>
      <ul><li>Your name, email, message and any invite link you include.</li></ul>
      <h3>Automatically</h3>
      <ul>
        <li><b>Technical logs:</b> our hosting provider records basic request data (such as IP address, browser type and time) to run and protect the service.</li>
        <li><b>Usage statistics:</b> we use privacy-friendly, aggregated analytics (Vercel Web Analytics) to count page views and see which pages are useful. It does not use cookies or build profiles of individuals.</li>
      </ul>
      <p>We do not collect bank, card or UPI PIN details, government IDs, or your contacts list.</p>

      <H2 id="use">3. How we use it</H2>
      <ul>
        <li>To run the service: create your account, save and show your invitation, record RSVPs and show them to the host, and keep you signed in.</li>
        <li>To support you: answer messages and fix problems you report.</li>
        <li>To keep the service safe: prevent spam, abuse and fraud (for example, limiting how often a form can be submitted).</li>
        <li>To improve it: understand which features and designs are used, using aggregated statistics.</li>
      </ul>
      <p>We process your information because you give it to us to use the service (your consent), and for legitimate uses allowed by law such as security and responding to legal requests. You can withdraw consent at any time by deleting your invitations or account (see <a href="#rights">Your rights</a>). We do not use your information for advertising and we do not sell it.</p>

      <H2 id="guests">4. Guests’ information</H2>
      <p>When a guest RSVPs, their answers go to the couple who sent the invitation; that is the point of an RSVP. The host can see, edit and download their guest list (for example as a spreadsheet), and decides what to do with it. We store guest replies on the host’s behalf to provide the service. Hosts must only use their guests’ details for their wedding and should not share them further.</p>
      <p>Invitation pages can be seen by anyone who has the link, and are hidden from Google and other search engines. RSVP answers are never shown on the public page.</p>

      <H2 id="share">5. Who we share it with</H2>
      <p>We share information only with service providers who help us run {site.name}, under contracts that require them to protect it and use it only for us:</p>
      <ul>
        <li><b>Vercel</b>: website hosting and aggregated analytics.</li>
        <li><b>MongoDB Atlas</b>: database hosting.</li>
        <li><b>Resend</b>: sending emails, such as replies to messages you send us.</li>
        <li><b>Google</b>: only if you choose “Sign in with Google”.</li>
      </ul>
      <p>These providers may store data on servers outside India. We may also disclose information if required by law or a valid order from a government authority, or to protect the safety of our users or the public. If {site.name} is ever merged or sold, your information would move to the new owner under this same policy, and we would tell you first.</p>

      <H2 id="cookies">6. Cookies &amp; browser storage</H2>
      <p>We use a small number of essential cookies. We do not use advertising or tracking cookies, so there is nothing to opt out of.</p>
      <table>
        <thead><tr><th>Name</th><th>Purpose</th><th>Lasts</th></tr></thead>
        <tbody>
          <tr><td>nm_session</td><td>Keeps a host signed in (secure, not readable by scripts).</td><td>30 days</td></tr>
          <tr><td>nm_li</td><td>Tells the page to show “My invites” instead of “Log in”. Grants no access.</td><td>30 days</td></tr>
          <tr><td>nm_rsvp_…, nm_shg_…</td><td>A private random key that lets a guest edit their own RSVP or shagun report later. Only sent to that invitation’s RSVP page; we store only a scrambled (hashed) copy.</td><td>1 year</td></tr>
          <tr><td>nm_tour_… (local storage)</td><td>Remembers that you have seen the guided tour.</td><td>Until cleared</td></tr>
        </tbody>
      </table>

      <H2 id="payments">7. Shagun &amp; payments</H2>
      <p>{site.name} is not a payment service. When a guest sends shagun, the money goes directly from their UPI app to the couple’s UPI ID; we never see, hold or process the payment, and we receive no banking details. The shagun register only records what guests report or hosts enter, so the couple can keep track.</p>

      <H2 id="keep">8. How long we keep it</H2>
      <ul>
        <li><b>Invitations, RSVPs and shagun entries:</b> until the host deletes the invitation (which deletes its RSVPs and shagun register too) or their account.</li>
        <li><b>Accounts:</b> until you ask us to delete your account.</li>
        <li><b>Messages to us:</b> as long as needed to help you, and no longer than two years.</li>
        <li><b>Technical logs:</b> a short period kept by our hosting provider for security.</li>
      </ul>
      <p>Deleted data may remain in encrypted backups for a limited time before it is overwritten.</p>

      <H2 id="security">9. Security</H2>
      <p>We use HTTPS everywhere, store passwords and guest edit keys only as one-way hashes, keep login cookies out of reach of page scripts, and check on every request that only an invitation’s host can see its guest list. No system is perfectly secure, so please use a strong password and keep your login private. If we learn of a breach that affects you, we will tell you and the authorities as the law requires.</p>

      <H2 id="rights">10. Your rights</H2>
      <p>Under Indian data protection law you can ask us to:</p>
      <ul>
        <li>tell you what personal data we hold about you and how we use it;</li>
        <li>correct or update it (hosts can edit most things directly in the editor);</li>
        <li>delete it (hosts can delete any invitation in the editor; for your whole account, contact us);</li>
        <li>handle a complaint (grievance), and nominate someone to act for you if you are unable to.</li>
      </ul>
      <p>To make a request, choose “Privacy or delete my data” on our <Link href="/contact">contact page</Link> or email {mail} from the address on your account. We will reply as soon as we can and within the time the law requires. Guests who want their RSVP changed or removed can edit it from the same browser, ask the couple, or contact us. If you are not satisfied with our answer, you may complain to the Data Protection Board of India.</p>

      <H2 id="children">11. Children</H2>
      <p>Accounts are for adults (18 or over). We do not knowingly collect personal data from children. If you believe a child has given us their details, contact us and we will delete them.</p>

      <H2 id="changes">12. Changes to this policy</H2>
      <p>If we change this policy, we will update the date at the top, and tell hosts by email or in the app before any important change takes effect.</p>

      <H2 id="contact">13. Contact &amp; grievance officer</H2>
      <p>Grievance officer: {site.legal.grievanceOfficer}{site.legal.operator !== site.name && <>, {site.legal.operator}</>}<br />Email: {mail}<br />Or use our <Link href="/contact">contact form</Link>. We acknowledge complaints within 24 hours and aim to resolve them within 15 days.</p>
    </LegalPage>
  );
}
