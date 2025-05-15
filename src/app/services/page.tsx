
import ServicesSection from "@/components/home/ServicesSection";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services - WanderWise',
  description: 'Discover the services WanderWise offers to help you plan your perfect trip.',
};

export default function ServicesPage() {
  return (
    <div className="py-8">
      <ServicesSection />
    </div>
  );
}
