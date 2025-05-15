
"use client";

import type * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { SavedPlan } from '@/types/wanderwise';
import ResultsDisplay from '@/components/wanderwise/ResultsDisplay';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Frown } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';


export default function ViewSavedPlanPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const planId = params.planId as string;

  const [plan, setPlan] = useState<SavedPlan | null | undefined>(undefined); // undefined for loading, null for not found
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.replace('/auth/login');
    } else if (currentUser && planId) {
      const fetchPlan = async () => {
        setIsLoadingPlan(true);
        try {
          const planDocRef = doc(db, `users/${currentUser.uid}/savedPlans`, planId);
          const planDocSnap = await getDoc(planDocRef);

          if (planDocSnap.exists()) {
            const data = planDocSnap.data();
            // Convert Firestore Timestamp to number for consistency if needed, or handle in ResultsDisplay
            const firestoreTimestamp = data.timestamp as any; // Firebase Timestamp object
            const planData: SavedPlan = {
              id: planDocSnap.id,
              userId: data.userId,
              timestamp: firestoreTimestamp?.toDate ? firestoreTimestamp.toDate().getTime() : Date.now(),
              suggestedCity: data.suggestedCity,
              itineraryData: data.itineraryData,
              finalDestinationCityToDisplay: data.finalDestinationCityToDisplay,
              uploadedImageFileName: data.uploadedImageFileName,
            };
            setPlan(planData);
          } else {
            setPlan(null); // Plan not found
          }
        } catch (error) {
          console.error("Error loading saved plan from Firestore:", error);
          setPlan(null); // Error occurred
        } finally {
          setIsLoadingPlan(false);
        }
      };
      fetchPlan();
    }
  }, [currentUser, authLoading, router, planId]);

  if (authLoading || isLoadingPlan || plan === undefined) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-200px)]"><LoadingSpinner text="Loading your saved plan..." /></div>;
  }

  if (!currentUser) {
    // Should be caught by redirect, but as a fallback
    return <div className="flex items-center justify-center min-h-[calc(100vh-200px)]"><p>Please log in to view this plan.</p></div>;
  }

  if (plan === null) {
    return (
      <div className="py-8 text-center">
        <Alert variant="destructive" className="max-w-lg mx-auto">
          <Frown className="h-5 w-5" />
          <AlertTitle>Plan Not Found</AlertTitle>
          <AlertDescription>
            We couldn't find the saved plan you're looking for. It might have been deleted or the link is incorrect.
          </AlertDescription>
        </Alert>
        <Button asChild className="mt-6">
          <Link href="/saved-plans">Back to Saved Plans</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mb-6 text-center">
        <Button asChild variant="outline">
          <Link href="/saved-plans">← Back to All Saved Plans</Link>
        </Button>
      </div>
      <ResultsDisplay
        suggestedCity={plan.suggestedCity}
        itineraryData={plan.itineraryData}
        uploadedImageFileName={plan.uploadedImageFileName}
        finalDestinationCityToDisplay={plan.finalDestinationCityToDisplay}
        isViewingSavedPlan={true} 
      />
    </div>
  );
}
