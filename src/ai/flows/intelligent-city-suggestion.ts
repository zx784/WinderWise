'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting a destination city based on user preferences.
 *
 * The flow takes user preferences as input and uses a generative AI model to suggest a city and provide a justification.
 * It exports the SuggestCityInput and SuggestCityOutput types, as well as the suggestCity function to trigger the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCityInputSchema = z.object({
  interests: z
    .array(z.string())
    .describe('A list of interests the user has, e.g., historical sites, nature, food.'),
  budget: z
    .enum(['budget-friendly', 'mid-range', 'luxury'])
    .describe('The user\u2019s budget preference.'),
  tripDuration: z
    .enum(['1 day', '3 days', '1 week'])
    .describe('The preferred trip duration.'),
  travelStyle: z
    .enum(['relaxed', 'adventurous', 'cultural'])
    .describe('The user\u2019s preferred travel style.'),
  customInterests: z
    .array(z.string())
    .optional()
    .describe('Optional list of custom interests specified by the user.'),
});

export type SuggestCityInput = z.infer<typeof SuggestCityInputSchema>;

const SuggestCityOutputSchema = z.object({
  suggestedCity: z.string().describe('The suggested city based on user preferences.'),
  justification: z.string().describe('A data-driven explanation of why the city is a good fit.'),
});

export type SuggestCityOutput = z.infer<typeof SuggestCityOutputSchema>;

export async function suggestCity(input: SuggestCityInput): Promise<SuggestCityOutput> {
  return suggestCityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCityPrompt',
  input: {schema: SuggestCityInputSchema},
  output: {schema: SuggestCityOutputSchema},
  prompt: `Based on the user's preferences, suggest a city for them to visit and justify your suggestion with data.

User Preferences:
Interests: {{#each interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{#if customInterests}}, and custom interests: {{#each customInterests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
Budget: {{{budget}}}
Trip Duration: {{{tripDuration}}}
Travel Style: {{{travelStyle}}}

Suggestion:`,
});

const suggestCityFlow = ai.defineFlow(
  {
    name: 'suggestCityFlow',
    inputSchema: SuggestCityInputSchema,
    outputSchema: SuggestCityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
