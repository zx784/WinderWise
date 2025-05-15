import Link from 'next/link';
import { Plane } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <Plane className="h-8 w-8" />
          <span>WanderWise</span>
        </Link>
        {/* Navigation items can be added here if needed */}
      </div>
    </header>
  );
}
