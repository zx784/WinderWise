
"use client";

import type * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { auth, db } from '@/lib/firebase';
import { updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; // For Firestore interaction
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { UserCircle, Edit3, Lock, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.replace('/auth/login'); // Redirect if not logged in
    } else if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      setNewDisplayName(currentUser.displayName || '');
      
      // Optionally, fetch display name from Firestore if it's the source of truth
      // const fetchFirestoreDisplayName = async () => {
      //   const userDocRef = doc(db, 'users', currentUser.uid);
      //   const userDocSnap = await getDoc(userDocRef);
      //   if (userDocSnap.exists() && userDocSnap.data().displayName) {
      //     setDisplayName(userDocSnap.data().displayName);
      //     setNewDisplayName(userDocSnap.data().displayName);
      //   }
      // };
      // fetchFirestoreDisplayName();
    }
  }, [currentUser, authLoading, router]);

  const handleUpdateDisplayName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newDisplayName.trim()) {
      toast({ title: "Update Failed", description: "Display name cannot be empty.", variant: "destructive" });
      return;
    }
    if (newDisplayName.trim() === displayName) {
      toast({ title: "No Change", description: "New display name is the same as the current one." });
      return;
    }

    setIsUpdatingName(true);
    try {
      await updateProfile(currentUser, { displayName: newDisplayName.trim() });
      
      // Optionally, update Firestore
      // const userDocRef = doc(db, 'users', currentUser.uid);
      // await setDoc(userDocRef, { displayName: newDisplayName.trim(), email: currentUser.email }, { merge: true });

      setDisplayName(newDisplayName.trim()); // Update local state
      toast({ title: "Profile Updated", description: "Your display name has been updated." });
    } catch (error: any) {
      console.error("Error updating display name:", error);
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentUser?.email) {
      toast({ title: "Error", description: "User email not found.", variant: "destructive"});
      return;
    }
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, currentUser.email);
      toast({ title: "Password Reset Email Sent", description: "Check your email to reset your password." });
    } catch (error: any) {
      console.error("Error sending password reset email:", error);
      toast({ title: "Error", description: error.message, variant: "destructive"});
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await auth.signOut();
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
      router.push('/');
    } catch (error: any) {
      console.error('Logout Error:', error);
      toast({ title: 'Logout Failed', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || !currentUser) {
    return <div className="flex items-center justify-center min-h-screen"><LoadingSpinner text="Loading profile..." /></div>;
  }

  return (
    <div className="py-8">
      <Card className="w-full max-w-2xl mx-auto shadow-xl bg-white dark:bg-slate-800">
        <CardHeader className="text-center">
          {currentUser.photoURL ? (
            <img src={currentUser.photoURL} alt="User" className="h-24 w-24 rounded-full mx-auto mb-4 border-2 border-primary" />
          ) : (
            <UserCircle className="mx-auto h-24 w-24 text-primary mb-4" />
          )}
          <CardTitle className="text-3xl font-bold">My Profile</CardTitle>
          <CardDescription>Manage your account details and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={currentUser.email || ''} readOnly disabled className="bg-muted/50" />
          </div>

          <form onSubmit={handleUpdateDisplayName} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <div className="flex gap-2">
                <Input
                  id="displayName"
                  type="text"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                  className="flex-grow"
                />
                <Button type="submit" disabled={isUpdatingName || newDisplayName.trim() === displayName} className="bg-primary hover:bg-primary/90">
                  <Edit3 className="mr-2 h-4 w-4" /> {isUpdatingName ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </form>
          
          <div className="space-y-3 pt-4 border-t border-border">
            <Button onClick={handleChangePassword} variant="outline" className="w-full" disabled={isLoading}>
              <Lock className="mr-2 h-4 w-4" /> Change Password
            </Button>
            <Button onClick={handleLogout} variant="destructive" className="w-full" disabled={isLoading}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </CardContent>
         <CardFooter>
           <p className="text-xs text-muted-foreground">
             Note: Changing password will send a reset link to your email. For enhanced security, Firebase recommends this method for authenticated users.
           </p>
         </CardFooter>
      </Card>
    </div>
  );
}

// Firestore security rules example (if storing display name in Firestore 'users' collection):
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /users/{userId} {
//       allow read: if request.auth != null;
//       allow write: if request.auth != null && request.auth.uid == userId;
//     }
//   }
// }
// Ensure Firestore is enabled in your Firebase console.
// Also enable Email/Password sign-in method in Firebase Authentication.
