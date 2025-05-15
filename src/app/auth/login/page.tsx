
"use client";

import type * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Ensure this path is correct
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!auth) {
      const authUnavailableError = "Firebase Auth is not available. Please check configuration.";
      setError(authUnavailableError);
      toast({ title: "Login Failed", description: authUnavailableError, variant: "destructive" });
      setIsLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Login Successful!", description: "Welcome back!" });
      router.push('/'); // Redirect to homepage
    } catch (err: any) {
      console.error("Detailed Login Error:", err); // Full error object
      const errorMessage = (err.code ? `(${err.code}) ` : '') + err.message;
      setError(errorMessage);
      toast({ title: "Login Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({ title: "Forgot Password", description: "Please enter your email address first.", variant: "destructive" });
      return;
    }
    setIsLoading(true);

    if (!auth) {
      const authUnavailableError = "Firebase Auth is not available. Please check configuration.";
      toast({ title: "Password Reset Failed", description: authUnavailableError, variant: "destructive" });
      setIsLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast({ title: "Password Reset Email Sent", description: "Check your inbox for instructions to reset your password." });
    } catch (err: any) {
      console.error("Detailed Password Reset Error:", err); // Full error object
      const errorMessage = (err.code ? `(${err.code}) ` : '') + err.message;
      toast({ title: "Password Reset Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl bg-white dark:bg-slate-800">
        <CardHeader className="text-center">
          <LogIn className="mx-auto h-10 w-10 text-primary mb-2" />
          <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
          <CardDescription>Log in to access your WanderWise plans.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
            <div className="text-right">
              <Button type="button" variant="link" size="sm" onClick={handleForgotPassword} className="p-0 h-auto text-primary" disabled={isLoading}>
                Forgot Password?
              </Button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? "Logging In..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm">
          <p>Don&apos;t have an account? <Link href="/auth/signup" className="font-medium text-primary hover:underline">Sign Up</Link></p>
        </CardFooter>
      </Card>
    </div>
  );
}
