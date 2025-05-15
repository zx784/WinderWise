
"use client";

import type * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Ensure this path is correct
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      toast({ title: "Signup Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      toast({ title: "Signup Error", description: "Password should be at least 6 characters.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
      toast({ title: "Signup Successful!", description: "Welcome! You are now logged in." });
      router.push('/profile'); // Or '/' or other designated page
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message);
      toast({ title: "Signup Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl bg-white dark:bg-slate-800">
        <CardHeader className="text-center">
          <UserPlus className="mx-auto h-10 w-10 text-primary mb-2" />
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>Join WanderWise to get personalized travel plans.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your Name"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-1"
              />
            </div>
            <div className="relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-1 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-7 h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="relative">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-1 pr-10"
              />
               <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-7 h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm">
          <p>Already have an account? <Link href="/auth/login" className="font-medium text-primary hover:underline">Login</Link></p>
        </CardFooter>
      </Card>
    </div>
  );
}
