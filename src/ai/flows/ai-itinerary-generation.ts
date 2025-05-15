// This is a server-side file.
'use server';

/**
 * @fileOverview Generates a personalized, day-by-day itinerary based on user preferences.
 *
 * - generateItinerary - A function that generates the itinerary.
 * - GenerateItineraryInput - The input type for the generateItinerary function.
 * - GenerateItineraryOutput - The return type for the generateItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateItineraryInputSchema = z.object({
  interests: z
    .array(z.string())
    .describe('A list of interests the user has (e.g., historical sites, nature, food).'),
  budget: z
    .enum(['budget-friendly', 'mid-range', 'luxury'])
    .describe('The user budget preference.'),
  tripDuration: z
    .enum(['1 day', '3 days', '1 week'])
    .describe('The duration of the trip.'),
  travelStyle: z
    .enum(['relaxed', 'adventurous', 'cultural'])
    .describe('The user travel style.'),
  destinationCity: z.string().describe('The destination city for the itinerary.'),
});
export type GenerateItineraryInput = z.infer<typeof GenerateItineraryInputSchema>;

const GenerateItineraryOutputSchema = z.object({
  itinerary: z
    .array(z.object({
      day: z.number().describe('The day number in the itinerary.'),
      activities: z.array(z.object({
        time: z.string().describe('The estimated time for the activity.'),
        description: z.string().describe('The description of the activity.'),
        alternatives: z.array(z.string()).describe('Alternative activity options.'),
      })).describe('A list of activities for the day.'),
    }))
    .describe('A detailed, day-by-day itinerary.'),
  costBreakdown: z.object({
    accommodation: z.string().describe('Estimated cost for accommodation.'),
    food: z.string().describe('Estimated cost for food.'),
    transportation: z.string().describe('Estimated cost for transportation.'),
    activities: z.string().describe('Estimated cost for activities.'),
  }).describe('A detailed cost breakdown for the trip.'),
});
export type GenerateItineraryOutput = z.infer<typeof GenerateItineraryOutputSchema>;

export async function generateItinerary(input: GenerateItineraryInput): Promise<GenerateItineraryOutput> {
  return generateItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateItineraryPrompt',
  input: {schema: GenerateItineraryInputSchema},
  output: {schema: GenerateItineraryOutputSchema},
  prompt: `You are an expert travel assistant. Generate a personalized, day-by-day itinerary based on the user's preferences.

Destination City: {{{destinationCity}}}
Interests: {{#each interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Budget: {{{budget}}}
Trip Duration: {{{tripDuration}}}
Travel Style: {{{travelStyle}}}

Output the itinerary in JSON format with the following structure:
{
  "itinerary": [
    {
      "day": 1,
      "activities": [
        {
          "time": "9:00 AM",
          "description": "Visit the Eiffel Tower.",
          "alternatives": ["Take a Seine River cruise.", "Explore the Louvre Museum."]
        }
      ]
    }
  ],
  "costBreakdown": {
    "accommodation": "$100 - $200",
    "food": "$50 - $100",
    "transportation": "$20 - $40",
    "activities": "$30 - $60"
  }
}
`,
});

const generateItineraryFlow = ai.defineFlow(
  {
    name: 'generateItineraryFlow',
    inputSchema: GenerateItineraryInputSchema,
    outputSchema: GenerateItineraryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

