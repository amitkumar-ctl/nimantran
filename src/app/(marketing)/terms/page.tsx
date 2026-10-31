import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/config/site';
import { H2, LegalPage } from '@/components/marketing/LegalPage';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `The rules for using ${site.name} to create wedding invitation websites, collect guest replies and share shagun details.`,
  alternates: { canonical: '/terms' },
};

const SECTIONS = [
  { id: 'agree', title: 'Agreeing to these terms' },
  { id: 'service', title: 'The service' },
  { id: 'account', title: 'Your account' },
  { id: 'content', title: 'Your content' },
  { id: 'use', title: 'Acceptable use' },
  { id: 'shagun', title: 'Shagun & payments' },
  { id: 'guests', title: 'Guests' },
  { id: 'ip', title: 'Our designs & brand' },
  { id: 'availability', title: 'Availability & changes' },
  { id: 'ending', title: 'Ending your use' },
  { id: 'liability', title: 'Disclaimers & liability' },
  { id: 'law', title: 'Governing law' },
  { id: 'contact', title: 'Contact & grievances' },
];

export default function TermsPage() {
  const mail = <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>;
  return (
    <LegalPage title="Terms of Service" sections={SECTIONS} intro={
      <p>These terms are the agreement between you and {site.legal.operator} for using {site.name}. We have tried to keep them short and in plain language. Please read them together with our <Link href="/privacy">Privacy Policy</Link>.</p>
    }>
      <H2 id="agree">1. Agreeing to these terms</H2>
      <p>By creating an account or using {site.name}, you agree to these terms. You must be at least 18 years old to create an account. If you use {site.name} for someone else (for example, for your sister’s wedding), you confirm you have their permission.</p>

      <H2 id="service">2. The service</H2>
      <p>{site.name} lets you create a wedding invitation website, share it by link or QR code, collect guest replies (RSVPs) and display shagun details. Creating and sharing invitations is currently free. If we introduce paid features, we will show the price clearly before you pay, and anything you have already published will keep working.</p>

      <H2 id="account">3. Your account</H2>
      <ul>
        <li>Give accurate details and keep your login private. You are responsible for what happens under your account.</li>
        <li>Tell us straight away at {mail} if you think someone else has access to it.</li>
        <li>One person may hold several invitations, but accounts are personal and may not be sold or transferred.</li>
      </ul>

      <H2 id="content">4. Your content</H2>
      <p>You own everything you put in your invitation: names, wording, dates, venues and so on. You give us permission to store, copy and display it only as needed to run the service (for example, to show your invite to people who open the link and to create its WhatsApp preview image). This permission ends when you delete the content, apart from short-lived backups.</p>
      <p>You are responsible for your content and confirm that you have the right to share it, including any personal details of family members and guests.</p>

      <H2 id="use">5. Acceptable use</H2>
      <p>Please don’t use {site.name} to:</p>
      <ul>
        <li>trick people: fake invitations, impersonating someone, or collecting money for an event that isn’t real;</li>
        <li>send spam, or collect other people’s personal data for anything other than the event;</li>
        <li>post content that is unlawful, hateful, obscene, defamatory, or infringes someone else’s rights;</li>
        <li>break, overload, scrape or probe the service, get around its limits, or access other people’s invitations or data;</li>
        <li>upload or link to malware or phishing pages.</li>
      </ul>
      <p>We may remove content or suspend accounts that break these rules, and we will cooperate with lawful requests from authorities.</p>

      <H2 id="shagun">6. Shagun &amp; payments</H2>
      <p>{site.name} is not a bank, wallet or payment service. Shagun is paid directly from a guest’s UPI app to the UPI ID the host enters, and we never receive, hold or transfer money. As a result:</p>
      <ul>
        <li>hosts are responsible for entering the correct UPI ID, and guests should check the name shown in their UPI app before paying;</li>
        <li>we cannot reverse, refund or trace a payment; please contact your bank or UPI app for any payment problem;</li>
        <li>the shagun register is a record that guests and hosts fill in themselves. It is not proof of payment.</li>
      </ul>

      <H2 id="guests">7. Guests</H2>
      <p>Guests don’t need an account. By replying to an invitation, a guest agrees that their answers are shared with the couple who invited them, as described in our <Link href="/privacy#guests">Privacy Policy</Link>. Questions about a particular wedding are best sent to the couple.</p>

      <H2 id="ip">8. Our designs &amp; brand</H2>
      <p>The {site.name} name and logo, the website, and the invitation designs (artwork, layouts and code) belong to us. You may use any design for your own invitations on {site.name}, including screenshots and printed QR cards for your event. You may not copy the designs or code to build another product or service.</p>

      <H2 id="availability">9. Availability &amp; changes</H2>
      <p>We work hard to keep {site.name} running, but we cannot promise it will always be available or error-free. Please keep your own copy of important information, such as your guest list (you can download it from the Guests page). We may improve, change or retire features over time; if we plan to shut down the service, we will give at least 30 days’ notice so you can download your data.</p>
      <p>We may update these terms. We will change the date at the top, and for important changes we will let hosts know in advance. If you keep using {site.name} after changes take effect, you accept the new terms.</p>

      <H2 id="ending">10. Ending your use</H2>
      <p>You can delete any invitation at any time from the editor, and ask us to delete your account through the <Link href="/contact">contact page</Link>. We may suspend or close an account that seriously or repeatedly breaks these terms, or if the law requires it; where reasonable, we will tell you why and give you a chance to download your data.</p>

      <H2 id="liability">11. Disclaimers &amp; liability</H2>
      <p>{site.name} is provided “as is”. To the extent the law allows, we are not liable for indirect or consequential losses (such as a missed booking, or a guest arriving at the wrong time because of incorrect details entered in an invitation), or for payments between guests and hosts. Our total liability to you for any claim is limited to the amount you paid us in the 12 months before the claim, or ₹1,000 if you have paid nothing. Nothing in these terms limits rights you have under consumer protection law that cannot be limited.</p>
      <p>You agree to compensate us for claims and costs caused by content you publish or by your breach of these terms.</p>

      <H2 id="law">12. Governing law</H2>
      <p>These terms are governed by the laws of India. Disputes will be handled by the courts in {site.legal.jurisdiction}, though we would always prefer to sort things out with you directly first.</p>

      <H2 id="contact">13. Contact &amp; grievances</H2>
      <p>Grievance officer: {site.legal.grievanceOfficer}{site.legal.operator !== site.name && <>, {site.legal.operator}</>}<br />Email: {mail}<br />Or use our <Link href="/contact">contact form</Link>. We acknowledge complaints within 24 hours and aim to resolve them within 15 days, in line with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.</p>
    </LegalPage>
  );
}
