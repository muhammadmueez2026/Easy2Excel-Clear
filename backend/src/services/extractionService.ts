import Anthropic from '@anthropic-ai/sdk';
import { AIExtractionResponse } from '../types/index.js';

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const MODEL = process.env.AI_MODEL || 'claude-sonnet-5-20250929';

export async function extractDataWithAI(
  rawText: string
): Promise<AIExtractionResponse> {
  if (!process.env.CLAUDE_API_KEY) {
    throw new Error(
      'CLAUDE_API_KEY not configured. Please set CLAUDE_API_KEY in .env'
    );
  }

  const prompt = `You are an expert data extraction and cleaning assistant.

Your task is to extract structured data from the following document text and return it as valid JSON.

CRITICAL RULES:
1. Return ONLY valid JSON, no markdown, no extra text, no explanations
2. Automatically identify column headers from the document
3. Extract all data rows preserving exact values
4. For each row, create an object with column names as keys
5. If a value is uncertain, missing, or illegible, use null (never invent data)
6. Detect and remove duplicate rows
7. Normalize column names to valid identifiers (alphanumeric + underscore)
8. Detect data types: text, number, date, currency
9. Provide confidence level based on data quality: high (clear, complete), medium (some uncertainty), low (significant issues)

Input document text:
---
${rawText}
---

Return ONLY this JSON structure, nothing else:
{
  "columns": [
    {
      "name": "Column Name",
      "type": "text|number|date|currency"
    }
  ],
  "rows": [
    {
      "Column Name": value,
      "Another Column": value
    }
  ],
  "confidence": "high|medium|low",
  "warnings": ["warning 1", "warning 2"]
}

If no structured data can be extracted, return:
{
  "columns": [],
  "rows": [],
  "confidence": "low",
  "warnings": ["Unable to extract structured data from this document"]
}`;

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract text content from response
    let responseText = '';
    for (const block of message.content) {
      if (block.type === 'text') {
        responseText = block.text;
        break;
      }
    }

    if (!responseText) {
      throw new Error('No text response from Claude API');
    }

    // Clean response - remove markdown if present
    let cleanedResponse = responseText.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.slice(7);
    }
    if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.slice(3);
    }
    if (cleanedResponse.endsWith('```')) {
      cleanedResponse = cleanedResponse.slice(0, -3);
    }
    cleanedResponse = cleanedResponse.trim();

    // Parse JSON response
    const result: AIExtractionResponse = JSON.parse(cleanedResponse);

    // Validate response structure
    if (!Array.isArray(result.columns) || !Array.isArray(result.rows)) {
      throw new Error('Invalid response structure from Claude API');
    }

    return result;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('Failed to parse Claude API response:', error);
      throw new Error(
        'Claude API returned invalid JSON. This may indicate the document format is not recognized or the API is having issues.'
      );
    }

    if (error instanceof Anthropic.APIError) {
      console.error('Claude API error:', error.message);
      throw new Error(`Claude API error: ${error.message}`);
    }

    throw error;
  }
}
