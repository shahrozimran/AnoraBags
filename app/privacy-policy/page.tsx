import type { Metadata } from "next"
import Link from "next/link"
import { HelpPage } from "@/components/anora/help-page"
import { STORE_CONTACT } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Anora Bags uses order, contact, and optional newsletter information, and how to contact us about your data.",
  alternates: { canonical: "/privacy-policy" },
}

export default function PrivacyPage() {
  return (
    <HelpPage title="Your privacy matters." description="Here’s how information is used when you browse, order, or get in touch with Anora Bags." path="/privacy-policy" sections={[
      { id: "information", title: "Information you share", content: <>
        <p>When you place an order, we collect the details needed to fulfil it: your name, phone number, email address if provided, delivery address, purchased items, selected colours, order total, and any delivery notes. We also keep order status and support correspondence needed to help you.</p>
        <p>If you join our mailing list, we save the email address you submit. We currently accept cash on delivery only, so we do not request card details for checkout.</p>
      </> },
      { id: "purpose", title: "How we use it", content: <ul>
        <li>Confirm orders, arrange courier delivery, and provide order tracking.</li>
        <li>Respond to questions and arrange returns, exchanges, or COD refunds.</li>
        <li>Send collection updates if you choose to subscribe.</li>
        <li>Understand website usage and maintain the service.</li>
      </ul> },
      { id: "sharing", title: "Delivery & service providers", content: <p>To deliver your order, we share necessary details such as your name, address, phone number, and COD amount with delivery partners. Hosting, storage, and website analytics providers may process information needed to operate the website. If you contact us through WhatsApp or email, those services also handle your message under their own privacy practices.</p> },
      { id: "browser", title: "Browser storage & analytics", content: <>
        <p>The shopping bag uses local storage in your browser to remember the items you add between visits. Clearing your browser’s site data removes that saved bag.</p>
        <p>The site includes Vercel Web Analytics to understand visits and page usage. For information about how that service handles analytics data, see <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel’s analytics privacy information</a>.</p>
      </> },
      { id: "newsletter", title: "Your newsletter choice", content: <p>Subscribing is optional. To stop collection updates or ask for your subscriber email to be removed, email <a href={`mailto:${STORE_CONTACT.email}?subject=Unsubscribe`}>{STORE_CONTACT.email}</a> with the subject “Unsubscribe”. You can still place an order without joining the mailing list.</p> },
      { id: "retention", title: "Storage & your requests", content: <p>Order and support details are kept to fulfil purchases, resolve queries, and maintain necessary business records. You can ask us to explain, correct, or delete information you have shared by contacting <a href={`mailto:${STORE_CONTACT.email}`}>{STORE_CONTACT.email}</a>. We may need to verify your request and retain information required for an active order or recordkeeping obligation.</p> },
      { id: "contact", title: "Questions or updates", content: <p>Contact us by <a href={STORE_CONTACT.whatsapp}>WhatsApp</a>, email, or through our <Link href="/contact">contact page</Link> with any privacy questions. We may revise this page when our website or services change; the current policy will be available here.</p> },
    ]} />
  )
}
