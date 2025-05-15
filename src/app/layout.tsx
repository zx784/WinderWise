
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/layout/Header';
import { AuthProvider } from '@/context/AuthContext'; // Import AuthProvider

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'WanderWise',
  description: 'Personalized travel suggestions powered by AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}> {/* Removed gradient classes */}
        <AuthProvider> {/* Wrap with AuthProvider */}
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8"> {/* Add flex-grow and container styling */}
            {children}
          </main>
          <footer className="bg-card text-card-foreground py-6 text-center text-sm border-t"> {/* Added border-t for separation */}
            <div className="container mx-auto px-4">
              <p>&copy; {new Date().getFullYear()} WanderWise. All rights reserved.</p>
              <div className="mt-2">
                <a href="/privacy-policy" className="hover:text-primary transition-colors px-2">Privacy Policy</a>
                <span className="text-muted-foreground">|</span>
                <a href="/terms-of-service" className="hover:text-primary transition-colors px-2">Terms of Service</a>
              </div>
            </div>
          </footer>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
