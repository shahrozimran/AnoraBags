import type { Metadata } from "next"
import Link from "next/link"
import { HelpPage } from "@/components/anora/help-page"

export const metadata: Metadata = {
  title: "Terms & conditions",
  description: "Information about shopping with Anora Bags, product availability, prices, COD orders, delivery, and returns.",
  alternates: { canonical: "/terms-and-conditions" },
}

export default function TermsPage() {
  return (
    <HelpPage title="Terms & conditions" description="Clear information for shopping with Anora Bags. Please read these terms alongside our delivery, return, and privacy policies." path="/terms-and-conditions" sections={[
      { id: "shopping", title: "Shopping with Anora", content: <p>These terms explain how orders through our website work. Please provide accurate contact and delivery details, place orders you intend to receive, and keep your order confirmation for reference. If you need help with any part of your order, <Link href="/contact">contact us</Link>.</p> },
      { id: "products", title: "Products & availability", content: <>
        <p>Available designs, colours, and prices are shown on each product page. Only the colour options listed are available. Photographs are intended to show the product clearly; lighting and screen settings can cause slight colour differences.</p>
        <p>Stock may change. If an item is unavailable or we identify an error affecting your order, we will contact you to explain the issue and discuss a replacement or cancellation before proceeding. We will not substitute a different bag or colour without your agreement.</p>
      </> },
      { id: "prices", title: "Prices & payment", content: <p>Prices are displayed in Pakistani rupees (Rs. / PKR). Review your items, quantities, and final total before placing an order. We currently accept <strong>Cash on Delivery only</strong>; payment is due to the courier when your parcel arrives. Online card, bank transfer, and mobile wallet payments are not available at checkout.</p> },
      { id: "orders", title: "Orders, changes & cancellations", content: <p>After placing an order, save the order number shown on your confirmation. We may contact you to confirm delivery details. For changes or cancellation, contact us promptly before dispatch. Once dispatched, available options depend on the courier’s progress; our team can help you with the next steps.</p> },
      { id: "delivery", title: "Delivery & returns", content: <p>Our <Link href="/delivery-policy">delivery policy</Link> explains coverage, estimated delivery times, and receiving your COD order. Our <Link href="/return-policy">return policy</Link> explains the 7-day request window, item condition, free collection, exchanges, and refunds. Delivery estimates can change due to courier or service disruptions.</p> },
      { id: "privacy", title: "Your information", content: <p>We use the details you provide to manage your order, delivery, and support requests. Our <Link href="/privacy-policy">privacy policy</Link> explains the information we collect and how to contact us about it. Newsletter signup is optional and separate from placing an order.</p> },
      { id: "use", title: "Using the website", content: <p>Please use the website responsibly. Do not attempt to access another customer’s order, interfere with the checkout, submit fraudulent orders, or misuse our content. Contact our team if you find an error or cannot complete an order.</p> },
      { id: "updates", title: "Policy updates & questions", content: <p>We may update these pages as our service changes. For an existing order, retain your confirmation and contact us about the terms that applied when you placed it. These terms do not limit any rights available to you under applicable law. Questions can be sent through our <Link href="/contact">contact page</Link>.</p> },
    ]} />
  )
}
