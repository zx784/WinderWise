
"use client";

import type * as React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { SavedPlan } from '@/types/wanderwise';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Library, MapPin, Calendar, ArrowRight, PlusCircle, Trash2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, orderBy, Timestamp, doc, deleteDoc } from 'firebase/firestore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

export default function SavedPlansPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<SavedPlan | null>(null);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.replace('/auth/login');
    } else if (currentUser) {
      const fetchSavedPlans = async () => {
        setIsLoadingPlans(true);
        try {
          const plansCollectionRef = collection(db, `users/${currentUser.uid}/savedPlans`);
          const q = query(plansCollectionRef, orderBy("timestamp", "desc"));
          const querySnapshot = await getDocs(q);
          const plans: SavedPlan[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            plans.push({
              id: doc.id,
              userId: data.userId,
              timestamp: (data.timestamp as Timestamp)?.toDate().getTime() || Date.now(),
              suggestedCity: data.suggestedCity,
              itineraryData: data.itineraryData,
              finalDestinationCityToDisplay: data.finalDestinationCityToDisplay,
              uploadedImageFileName: data.uploadedImageFileName,
            });
          });
          setSavedPlans(plans);
        } catch (error) {
          console.error("Error loading saved plans from Firestore:", error);
          toast({ title: "Error Loading Plans", description: "Could not fetch your saved plans. Please try again.", variant: "destructive" });
        } finally {
          setIsLoadingPlans(false);
        }
      };
      fetchSavedPlans();
    }
  }, [currentUser, authLoading, router, toast]);

  const openDeleteDialog = (plan: SavedPlan) => {
    setPlanToDelete(plan);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!planToDelete || !currentUser) return;
    setIsDeleting(true);
    try {
      const planDocRef = doc(db, `users/${currentUser.uid}/savedPlans`, planToDelete.id);
      await deleteDoc(planDocRef);
      setSavedPlans(prevPlans => prevPlans.filter(p => p.id !== planToDelete.id));
      toast({ title: "Plan Deleted", description: "The saved plan has been successfully deleted." });
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast({ title: "Delete Failed", description: "Could not delete the plan. Please try again.", variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setPlanToDelete(null);
    }
  };

  if (authLoading || isLoadingPlans) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-200px)]"><LoadingSpinner text="Loading your saved plans..." /></div>;
  }

  if (!currentUser) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-200px)]"><p>Please log in to view your saved plans.</p></div>;
  }

  return (
    <div className="py-8">
      <Card className="w-full max-w-4xl mx-auto shadow-xl bg-card">
        <CardHeader className="text-center border-b pb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Library className="h-10 w-10 text-primary" />
            <div>
              <CardTitle className="text-3xl font-bold text-left">My Saved Plans</CardTitle>
              <CardDescription className="text-left">Here are all the amazing trips you've planned.</CardDescription>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href="/">
              <PlusCircle className="mr-2 h-4 w-4" /> Plan a New Trip
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          {savedPlans.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xl text-muted-foreground mb-4">You haven't saved any plans yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {savedPlans.map((plan) => (
                <Card key={plan.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
                  <CardHeader className="bg-secondary/30">
                    <CardTitle className="text-xl text-primary flex items-center gap-2">
                      <MapPin className="h-5 w-5 flex-shrink-0" />
                      {plan.finalDestinationCityToDisplay || plan.suggestedCity?.suggestedCity || "Unnamed Plan"}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5 text-sm pt-1">
                      <Calendar className="h-4 w-4" />
                      Saved on: {new Date(plan.timestamp).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="py-3 flex-grow">
                    {plan.itineraryData?.itinerary?.length ? (
                       <p className="text-sm text-muted-foreground">
                         A {plan.itineraryData.itinerary.length}-day adventure awaits!
                       </p>
                    ): (
                       <p className="text-sm text-muted-foreground">
                         City suggestion with details.
                       </p>
                    )}
                  </CardContent>
                  <CardFooter className="bg-muted/30 p-4 flex flex-col sm:flex-row sm:justify-between gap-2 items-stretch sm:items-center">
                    <Button asChild variant="default" size="sm" className="flex-grow sm:flex-grow-0">
                      <Link href={`/saved-plans/${plan.id}`}>
                        View Full Plan <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-grow sm:flex-grow-0"
                      onClick={() => openDeleteDialog(plan)}
                      disabled={isDeleting && planToDelete?.id === plan.id}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {isDeleting && planToDelete?.id === plan.id ? "Deleting..." : "Delete"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) setPlanToDelete(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this plan?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the plan for
              "{planToDelete?.finalDestinationCityToDisplay || planToDelete?.suggestedCity?.suggestedCity || 'this plan'}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPlanToDelete(null)} disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
