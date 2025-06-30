'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate a summary of a client's maintenance request,
 * including AI analysis results, to help administrators quickly understand the issue.
 *
 * - generateRequestSummary - A function that generates a summary of the client request.
 * - GenerateRequestSummaryInput - The input type for the generateRequestSummary function.
 * - GenerateRequestSummaryOutput - The return type for the generateRequestSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRequestSummaryInputSchema = z.object({
  problemDescription: z.string().describe('The description of the maintenance problem provided by the client.'),
  problemPhotoDataUri: z
    .string()
    .describe(
      "A photo of the problem, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  aiAnalysisResults: z.string().describe('The AI analysis results of the problem photo.'),
  clientPhoneNumber: z.string().describe('The client phone number.'),
  clientGeolocation: z.string().describe('The client geolocation.'),
});
export type GenerateRequestSummaryInput = z.infer<typeof GenerateRequestSummaryInputSchema>;

const GenerateRequestSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the client request including the AI analysis results.'),
});
export type GenerateRequestSummaryOutput = z.infer<typeof GenerateRequestSummaryOutputSchema>;

export async function generateRequestSummary(input: GenerateRequestSummaryInput): Promise<GenerateRequestSummaryOutput> {
  return generateRequestSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRequestSummaryPrompt',
  input: {schema: GenerateRequestSummaryInputSchema},
  output: {schema: GenerateRequestSummaryOutputSchema},
  prompt: `You are an expert maintenance request summarizer.

  You will receive the client's problem description, a photo of the problem, AI analysis results of the photo, the client's phone number, and the client's geolocation.
  You will generate a concise summary of the client request, including the AI analysis results.

  Problem Description: {{{problemDescription}}}
  Problem Photo: {{media url=problemPhotoDataUri}}
  AI Analysis Results: {{{aiAnalysisResults}}}
  Client Phone Number: {{{clientPhoneNumber}}}
  Client Geolocation: {{{clientGeolocation}}}

  Summary:
  `,
});

const generateRequestSummaryFlow = ai.defineFlow(
  {
    name: 'generateRequestSummaryFlow',
    inputSchema: GenerateRequestSummaryInputSchema,
    outputSchema: GenerateRequestSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
