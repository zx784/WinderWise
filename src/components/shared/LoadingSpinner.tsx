"use client";
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  text?: string;
}

export default function LoadingSpinner({ text = "Loading..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 p-8">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-lg text-muted-foreground">{text}</p>
    </div>
  );
}
