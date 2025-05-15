
"use client";

import Link from 'next/link';
import { Plane, LogIn, UserPlus, UserCircle, LogOut, LayoutDashboard, Info, ListChecks, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { useRouter } from 'next/navigation'; // Use App Router's navigation
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

export default function Header() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await firebaseSignOut(auth);
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
      router.push('/'); // Redirect to home page after logout
    } catch (error: any) {
      console.error('Logout Error:', error);
      toast({ title: 'Logout Failed', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-800 text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold hover:opacity-90 transition-opacity">
          <Plane className="h-8 w-8 transform rotate-[-45deg]" />
          <span>WanderWise</span>
        </Link>
        
        <nav className="flex items-center gap-3 md:gap-4">
          <Link href="/#about-us" className="text-sm hover:text-sky-200 transition-colors hidden md:inline">About</Link>
          <Link href="/#our-services" className="text-sm hover:text-sky-200 transition-colors hidden md:inline">Services</Link>
          <Link href="/#contact-us" className="text-sm hover:text-sky-200 transition-colors hidden md:inline">Contact</Link>
          
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full h-9 w-9 p-0 hover:bg-white/20">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="User" className="h-8 w-8 rounded-full" />
                  ) : (
                    <UserCircle className="h-7 w-7" />
                  )}
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  My Account
                  {currentUser.email && <p className="text-xs font-normal text-muted-foreground truncate">{currentUser.email}</p>}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400 focus:text-red-700 focus:bg-red-100 dark:focus:bg-red-700/20 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild className="border-white/80 text-white hover:bg-white/10 hover:text-white">
                <Link href="/auth/login">
                  <LogIn className="mr-1.5 h-4 w-4" /> Login
                </Link>
              </Button>
              <Button size="sm" asChild className="bg-sky-300 text-indigo-700 hover:bg-sky-200">
                <Link href="/auth/signup">
                  <UserPlus className="mr-1.5 h-4 w-4" /> Sign Up
                </Link>
              </Button>
            </>
          )}
          {/* Mobile menu trigger can be added here if needed */}
        </nav>
      </div>
    </header>
  );
}
