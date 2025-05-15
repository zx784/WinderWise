
import AboutSection from "@/components/home/AboutSection";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - WanderWise',
  description: 'Learn more about WanderWise and our mission to simplify travel planning.',
};

export default function AboutPage() {
  return (
    <div className="py-8">
      <AboutSection />
    </div>
  );
}
