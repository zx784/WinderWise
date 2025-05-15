
"use client";

import Link from 'next/link';
import { Plane, LogIn, UserPlus, UserCircle, LogOut, LayoutDashboard, Library } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
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
      router.push('/');
    } catch (error: any) {
      console.error('Logout Error:', error);
      toast({ title: 'Logout Failed', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <header className="bg-card text-foreground shadow-md sticky top-0 z-50 border-b"> {/* Changed background, text color, added border */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold hover:opacity-80 transition-opacity">
          <Plane className="h-8 w-8 transform rotate-[-45deg] text-primary" /> {/* Logo icon uses primary color */}
          <span className="text-foreground">WanderWise</span> {/* Ensure title uses foreground color */}
        </Link>

        <nav className="flex items-center gap-3 md:gap-4">
          <Link href="/about" className="text-sm text-foreground hover:text-primary transition-colors hidden md:inline">About</Link>
          <Link href="/services" className="text-sm text-foreground hover:text-primary transition-colors hidden md:inline">Services</Link>
          <Link href="/contact" className="text-sm text-foreground hover:text-primary transition-colors hidden md:inline">Contact</Link>

          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full h-9 w-9 p-0 hover:bg-accent/10">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="User" className="h-8 w-8 rounded-full" />
                  ) : (
                    <UserCircle className="h-7 w-7 text-muted-foreground hover:text-primary" />
                  )}
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  My Account
                  {currentUser.displayName && <p className="text-sm font-semibold text-foreground truncate">{currentUser.displayName}</p>}
                  {currentUser.email && <p className="text-xs font-normal text-muted-foreground truncate">{currentUser.email}</p>}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/saved-plans" className="flex items-center cursor-pointer">
                    <Library className="mr-2 h-4 w-4" /> Saved Plans
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="text-foreground hover:text-primary hover:bg-accent/10">
                <Link href="/auth/login">
                  <LogIn className="mr-1.5 h-4 w-4" /> Login
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                <Link href="/auth/signup">
                  <UserPlus className="mr-1.5 h-4 w-4" /> Sign Up
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
