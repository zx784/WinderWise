
import ContactSection from "@/components/home/ContactSection";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - WanderWise',
  description: 'Get in touch with the WanderWise team.',
};

export default function ContactPage() {
  return (
    <div className="py-8">
      <ContactSection />
    </div>
  );
}
