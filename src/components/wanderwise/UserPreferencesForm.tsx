
"use client";

import type * as React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
// Assuming types are co-located or re-exported. SuggestCityInput is used for type consistency, actual payload might differ for each flow.
import type { SuggestCityInput as AISuggestCityInput } from '@/ai/flows/intelligent-city-suggestion'; 
import type { GenerateItineraryInput as AIGenerateItineraryInput } from '@/ai/flows/ai-itinerary-generation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, MapPin, CalendarDays, DollarSign, Settings2, Palette, Users, Utensils, TreePine, Landmark, PartyPopper, Backpack, Coffee, BuildingIcon } from 'lucide-react';

const interestsList = [
  { id: "historical_sites", label: "Historical Sites", icon: Landmark },
  { id: "nature", label: "Nature", icon: TreePine },
  { id: "food", label: "Food", icon: Utensils },
  { id: "nightlife", label: "Nightlife", icon: PartyPopper },
  { id: "art", label: "Art", icon: Palette },
  { id: "family_activities", label: "Family Activities", icon: Users },
] as const;

const budgetOptions = [
  { value: "budget-friendly", label: "Budget-Friendly" },
  { value: "mid-range", label: "Mid-Range" },
  { value: "luxury", label: "Luxury" },
] as const;

const tripDurationOptions = [
  { value: "1 day", label: "1 Day" },
  { value: "2 days", label: "2 Days" },
  { value: "3 days", label: "3 Days" },
  { value: "1 week", label: "1 Week" },
  { value: "10 days", label: "10 Days" },
  { value: "2 weeks", label: "2 Weeks" },
  { value: "1 month", label: "1 Month" },
  { value: "custom", label: "Custom" },
] as const;

type TripDurationValue = typeof tripDurationOptions[number]['value'];


const travelStyleOptions = [
  { value: "relaxed", label: "Relaxed", icon: Coffee },
  { value: "adventurous", label: "Adventurous", icon: Backpack },
  { value: "cultural", label: "Cultural", icon: BuildingIcon },
] as const;

export const formSchema = z.object({
  destinationCity: z.string().optional(),
  interests: z.array(z.string()).min(1, { message: "Select at least one interest." }),
  customInterests: z.string().optional(),
  budget: z.enum(['budget-friendly', 'mid-range', 'luxury']),
  tripDuration: z.enum(["1 day", "2 days", "3 days", "1 week", "10 days", "2 weeks", "1 month", "custom"]),
  travelStyle: z.enum(['relaxed', 'adventurous', 'cultural']),
  imageFile: z.custom<FileList>().optional(),
});

export type UserPreferencesFormValues = z.infer<typeof formSchema>;

// Ensure AI flow input types match form options
type ExpectedAISuggestCityTripDuration = AISuggestCityInput['tripDuration'];
type ExpectedAIGenerateItineraryTripDuration = AIGenerateItineraryInput['tripDuration'];

// This is a type assertion to ensure consistency, it won't run at runtime
// but will error at build time if types diverge.
const _tripDurationAssertionSuggest: TripDurationValue = "" as ExpectedAISuggestCityTripDuration;
const _tripDurationAssertionGenerate: TripDurationValue = "" as ExpectedAIGenerateItineraryTripDuration;


interface UserPreferencesFormProps {
  onSubmit: (values: UserPreferencesFormValues) => void;
  isLoading: boolean;
}

export default function UserPreferencesForm({ onSubmit, isLoading }: UserPreferencesFormProps) {
  const form = useForm<UserPreferencesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: [],
      budget: "mid-range",
      tripDuration: "3 days",
      travelStyle: "cultural",
    },
  });

  function handleFormSubmit(data: UserPreferencesFormValues) {
    onSubmit(data);
  }

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-primary flex items-center justify-center gap-2">
          <Settings2 className="h-8 w-8" /> Plan Your Next Adventure
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="destinationCity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold flex items-center gap-2"><MapPin className="text-accent"/>Destination City (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Paris, Kyoto, Rome" {...field} />
                  </FormControl>
                  <FormDescription>
                    Leave blank for an AI-powered suggestion based on your preferences.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interests"
              render={() => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Interests</FormLabel>
                  <FormDescription>Select your main interests.</FormDescription>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                    {interestsList.map((interest) => (
                      <FormField
                        key={interest.id}
                        control={form.control}
                        name="interests"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={interest.id}
                              className="flex flex-row items-center space-x-3 space-y-0 bg-background p-3 rounded-md border border-input hover:bg-secondary/80 transition-colors"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(interest.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), interest.id])
                                      : field.onChange(
                                          (field.value || []).filter(
                                            (value) => value !== interest.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal flex items-center gap-2 cursor-pointer">
                                <interest.icon className="h-5 w-5 text-primary" />
                                {interest.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="customInterests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Custom Interests</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., street art, vintage shopping, specific cuisines" {...field} />
                  </FormControl>
                  <FormDescription>
                    Add any other interests, separated by commas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-3 gap-8">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-lg font-semibold flex items-center gap-2"><DollarSign className="text-accent"/>Budget</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        {budgetOptions.map(option => (
                          <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={option.value} />
                            </FormControl>
                            <FormLabel className="font-normal">{option.label}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tripDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold flex items-center gap-2"><CalendarDays className="text-accent"/>Trip Duration</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select trip duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tripDurationOptions.map(option => (
                           <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select "Custom" if you have a specific number of days not listed. The AI will adapt.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
              control={form.control}
              name="travelStyle"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-lg font-semibold">Travel Style</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2"
                    >
                      {travelStyleOptions.map((option) => (
                        <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={option.value} />
                          </FormControl>
                          <FormLabel className="font-normal flex items-center gap-2">
                            <option.icon className="h-5 w-5 text-primary"/>
                            {option.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            
            <FormField
              control={form.control}
              name="imageFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold flex items-center gap-2"><UploadCloud className="text-accent"/>Upload an Image (Optional)</FormLabel>
                  <FormControl>
                     <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                  </FormControl>
                  <FormDescription>
                    Upload an image of a place you like. AI-powered place recognition and related suggestions are a planned feature.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6">
              {isLoading ? "Generating Recommendations..." : "Get My Travel Plan"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

