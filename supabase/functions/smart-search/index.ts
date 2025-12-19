import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// UAE facilities data for context
const facilitiesContext = `
Available facility types in UAE:
- Healthcare: Hospitals, Clinics, Pharmacies, Diagnostic Centers, Healthcare Centers, Ambulance Stations, Rehabilitation Centres, Mobile Health Units
- Education: Public Schools, Private Schools, Charter Schools, Nurseries, POD Centers

Emirates: Abu Dhabi, Dubai, Sharjah, Ajman, Ras Al Khaimah, Fujairah, Umm Al Quwain
`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, userLocation } = await req.json();
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Processing search query:', query);
    console.log('User location:', userLocation);

    const systemPrompt = `You are an AI assistant for a Smart Map application in the UAE. Your job is to understand user search queries about healthcare and education facilities and return structured data.

${facilitiesContext}

Given a user query, analyze it and return a JSON response with:
1. "intent": The type of search (e.g., "nearest", "in_area", "by_type", "general")
2. "facilityTypes": Array of facility types to filter (e.g., ["Hospitals", "Clinics"])
3. "emirate": Specific emirate if mentioned (null if not)
4. "themes": Array of themes - "healthcare" and/or "education"
5. "isProximitySearch": Boolean - true if user wants nearest/nearby facilities
6. "keywords": Array of extracted keywords for additional filtering
7. "suggestedZoom": Number 8-16 for map zoom level based on search scope
8. "responseMessage": A friendly message to show the user about what was found

Examples:
- "nearest hospital" → {"intent": "nearest", "facilityTypes": ["Hospitals"], "emirate": null, "themes": ["healthcare"], "isProximitySearch": true, "keywords": ["hospital"], "suggestedZoom": 14, "responseMessage": "Showing hospitals near your location"}
- "schools in Abu Dhabi" → {"intent": "in_area", "facilityTypes": ["Public Schools", "Private Schools"], "emirate": "Abu Dhabi", "themes": ["education"], "isProximitySearch": false, "keywords": ["schools"], "suggestedZoom": 11, "responseMessage": "Showing schools in Abu Dhabi"}
- "pharmacies near me" → {"intent": "nearest", "facilityTypes": ["Pharmacies"], "emirate": null, "themes": ["healthcare"], "isProximitySearch": true, "keywords": ["pharmacy"], "suggestedZoom": 14, "responseMessage": "Showing pharmacies near your location"}

Return ONLY valid JSON, no additional text.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `User query: "${query}"${userLocation ? `\nUser coordinates: ${userLocation.lat}, ${userLocation.lng}` : ''}` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;
    
    console.log('AI response:', aiResponse);

    // Parse the AI response
    let parsedResponse;
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanResponse = aiResponse.trim();
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.slice(7);
      }
      if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.slice(3);
      }
      if (cleanResponse.endsWith('```')) {
        cleanResponse = cleanResponse.slice(0, -3);
      }
      parsedResponse = JSON.parse(cleanResponse.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback to basic parsing
      parsedResponse = {
        intent: 'general',
        facilityTypes: [],
        emirate: null,
        themes: ['healthcare', 'education'],
        isProximitySearch: query.toLowerCase().includes('near') || query.toLowerCase().includes('nearest'),
        keywords: query.toLowerCase().split(' ').filter((w: string) => w.length > 2),
        suggestedZoom: 12,
        responseMessage: `Showing results for "${query}"`
      };
    }

    return new Response(
      JSON.stringify(parsedResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Smart search error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
