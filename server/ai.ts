import { GoogleGenAI, Type, FunctionDeclaration, GenerateContentResponse } from "@google/genai";
import { 
  STADIUMS, 
  MATCHES, 
  FOOD_STALLS, 
  WASHROOMS, 
  FACILITIES, 
  TRANSPORT_OPTIONS, 
  STADIUM_POLICIES 
} from "./data.js";
import { sanitizeModelOutput } from "./security.js";

// Initialize GoogleGenAI SDK on the server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Tool declarations
const getStadiumStatus: FunctionDeclaration = {
  name: "getStadiumStatus",
  description: "Retrieves the real-time gate congestion, open/closed gates, and average queue wait times at various entrance gates.",
  parameters: {
    type: Type.OBJECT,
    properties: {}
  }
};

const getMatchWeatherAndInfo: FunctionDeclaration = {
  name: "getMatchWeatherAndInfo",
  description: "Retrieves World Cup 2026 match schedules, teams, kickoff times, temperatures, and dynamic weather conditions.",
  parameters: {
    type: Type.OBJECT,
    properties: {}
  }
};

const getFoodStallsList: FunctionDeclaration = {
  name: "getFoodStallsList",
  description: "Retrieves food stalls, sections, queue lengths in minutes, popular items, rating, and special dietary tags (Vegetarian, Vegan, Gluten-Free, Halal).",
  parameters: {
    type: Type.OBJECT,
    properties: {}
  }
};

const getWashroomsList: FunctionDeclaration = {
  name: "getWashroomsList",
  description: "Retrieves the list of stadium washrooms with exact sections, gender classifications, ADA wheelchair accessibility, cleanliness scores (out of 10), and current wait times in minutes.",
  parameters: {
    type: Type.OBJECT,
    properties: {}
  }
};

const getFacilitiesList: FunctionDeclaration = {
  name: "getFacilitiesList",
  description: "Retrieves stadium support hubs like phone charging stations, medical centers, first aid posts, and merchandise mega-stores.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      type: {
        type: Type.STRING,
        description: "The category of facilities: 'charging', 'medical', 'merchandise', 'emergency', or 'all'.",
        enum: ['charging', 'medical', 'merchandise', 'emergency', 'all']
      }
    }
  }
};

const getTransportAndExits: FunctionDeclaration = {
  name: "getTransportAndExits",
  description: "Retrieves transport modes, metro line delays, parking lot capacities, shuttle schedules, and smart post-match evacuation guidelines.",
  parameters: {
    type: Type.OBJECT,
    properties: {}
  }
};

const getStadiumFAQ: FunctionDeclaration = {
  name: "getStadiumFAQ",
  description: "Retrieves official stadium policies including prohibited items, clear bag rules, maximum power bank capacities, camera sizes, and alcohol sales limit times.",
  parameters: {
    type: Type.OBJECT,
    properties: {}
  }
};

const toolsList = [
  {
    functionDeclarations: [
      getStadiumStatus,
      getMatchWeatherAndInfo,
      getFoodStallsList,
      getWashroomsList,
      getFacilitiesList,
      getTransportAndExits,
      getStadiumFAQ
    ]
  }
];

// Execute local function logic based on model call
function executeToolLocal(name: string, args: any) {
  console.log(`[AI Copilot] Executing local tool: ${name} with args:`, args);
  switch (name) {
    case "getStadiumStatus":
      return { stadiums: STADIUMS };
    case "getMatchWeatherAndInfo":
      return { matches: MATCHES };
    case "getFoodStallsList":
      return { foodStalls: FOOD_STALLS };
    case "getWashroomsList":
      return { washrooms: WASHROOMS };
    case "getFacilitiesList":
      const reqType = args?.type || 'all';
      return {
        facilities: reqType === 'all' 
          ? FACILITIES 
          : FACILITIES.filter(f => f.type === reqType)
      };
    case "getTransportAndExits":
      return { transportOptions: TRANSPORT_OPTIONS };
    case "getStadiumFAQ":
      return { policies: STADIUM_POLICIES };
    default:
      return { error: `Tool ${name} not found` };
  }
}

interface ChatRequest {
  message: string;
  history: Array<{
    role: 'user' | 'model';
    parts: Array<{ text: string }>;
  }>;
  setup: {
    stadiumId: string;
    matchId: string;
    seat: string;
    language: string;
    accessibility: string;
    transport: string;
  };
}

export async function handleCopilotChat(req: ChatRequest) {
  const { message, history, setup } = req;

  // Find user active stadium and match
  const selectedStadium = STADIUMS.find(s => s.id === setup.stadiumId) || STADIUMS[0];
  const selectedMatch = MATCHES.find(m => m.id === setup.matchId) || MATCHES[0];

  // Construct dynamic system instructions tailoring output to active user profile
  const systemInstruction = `You are "Stadium Copilot AI", an elite personal assistant for fans attending the FIFA World Cup 2026.
You are helping a fan with the following live matchday profile:
- Stadium: ${selectedStadium.name} (${selectedStadium.city})
- Active Match: ${selectedMatch.teams} (Group: ${selectedMatch.group})
- Match Kickoff Time: ${selectedMatch.dateTime}
- User Seat Location: Section ${setup.seat}
- Preferred Language: ${setup.language}
- Accessibility Preference: ${setup.accessibility} (Crucial: prioritize facilities with ADA access, avoid stairs for Wheelchair, use rich voice cues descriptions for Blind, etc.)
- Transport Mode: ${setup.transport}

GUIDELINES FOR YOUR BEHAVIOR:
1. BASE ALL REAL-TIME DETAILS ON DATA RETRIEVED VIA YOUR TOOLS. Never invent queue times, gate statuses, or weather forecasts.
2. Formulate helpful, beautiful, well-formatted markdown responses exclusively in the user's preferred language: ${setup.language}.
3. Proactively support the fan's accessibility needs. If they prefer Wheelchair, recommend ramps, elevators, and ADA gates (like MetLife Gate E, Azteca Gate 2, or SoFi Gate 4).
4. If asked about WASHROOMS, do not just find the closest one. Compare current queue wait times and cleanliness scores to recommend the absolute FASTEST washroom, explaining why.
5. If asked about FOOD, recommend stalls matching dietary filters (e.g., Vegetarian, Vegan, Gluten-Free, Halal) and current line speeds.
6. If asked about EXITING, use gate crowd levels and metro statuses to suggest the best gate and explain why.
7. Keep responses concise, visually engaging, structured with lists, bullet points, bold markers, and supportive icons.
8. If the user lost their friend or faces an emergency, guide them immediately to the closest Medical Station (Main Medical at Section 110 or First Aid Section 132 for MetLife) and instruct them to remain calm, providing emergency contact numbers.
9. Support the user through local language and translated stadium announcements using your natural multi-lingual capability.
10. FOR EVERY STADIUM RECOMMENDATION OR ADVICE QUERY, you MUST output these four custom structured blocks in your response, styled EXACTLY as below:

:::thinking
[Step 1 description - what you are evaluating first]
[Step 2 description - e.g. checking crowd levels, weather, transport schedules]
[Step 3 description - e.g. factoring in match kickoff time and user walk speeds]
[Step 4 description - e.g. building optimal ADA/accessibility recommendation]
:::

:::confidence
Score: [High | Medium | Low]
Reason: [A clear 1-sentence reason justifying the confidence score, e.g., turnstile sensor APIs are streaming live 15s telemetry data.]
:::

:::factors
[factor-type-1]: [A concise factor with custom emoji or label. E.g., crowd: Gate E has 5m queue vs Gate B 35m]
[factor-type-2]: [E.g., time: Saves 18 minutes of walk time]
[factor-type-3]: [E.g., accessibility: 100% ramp-access path, no stairs]
:::

:::alternatives
- **Best Overall**: [E.g., Gate E: direct ramp access, 4m queue, 120m walk]
- **Fastest Option**: [E.g., Gate A: 5m queue, but includes 300m stairs walk]
- **Shortest Walk**: [E.g., Gate B: 20m from seat but 35m congested queue]
:::

Do not skip these blocks. They are used by the visual client interface to build interactive cards.`;

  try {
    // Stage 1: Send query to Gemini with tools
    console.log(`[AI Copilot] Contacting Gemini for message: "${message}"`);
    const initialResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction,
        tools: toolsList
      }
    });

    const functionCalls = initialResponse.functionCalls;
    
    if (functionCalls && functionCalls.length > 0) {
      console.log(`[AI Copilot] Model requested function calls:`, functionCalls);
      
      // Execute all requested functions and compile outcomes
      const toolResultsContext: string[] = [];
      for (const call of functionCalls) {
        const result = executeToolLocal(call.name, call.args);
        toolResultsContext.push(`Outcome of tool call '${call.name}': ${JSON.stringify(result)}`);
      }

      // Stage 2: Send outcomes back to the model for the final answer
      const followUpPrompt = `The real-time database query returned the following live data for you to use:
${toolResultsContext.join("\n\n")}

Please formulate a helpful, complete, and friendly final response to the user in ${setup.language}. Explicitly reference the real-time facts (e.g. queue lengths, specific section gates) to answer their query perfectly. Ensure you justify why you are recommending specific gates or washrooms based on this data.`;

      console.log(`[AI Copilot] Sending tool outputs to Gemini for final response...`);
      const finalResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          ...history,
          { role: 'user', parts: [{ text: message }] },
          { role: 'model', parts: [{ text: "Gathering stadium data..." }] },
          { role: 'user', parts: [{ text: followUpPrompt }] }
        ],
        config: {
          systemInstruction
        }
      });

      return {
        text: sanitizeModelOutput(finalResponse.text || "I apologize, I processed the stadium data but couldn't generate a text response. Please try again."),
        toolCalls: functionCalls.map(c => c.name)
      };
    } else {
      // Direct text answer (no tool needed or fallback)
      return {
        text: sanitizeModelOutput(initialResponse.text || "I'm here to help! What stadium details can I find for you?"),
        toolCalls: []
      };
    }
  } catch (error: any) {
    console.error("[AI Copilot] Error in handleCopilotChat:", error);
    return {
      text: `I encountered an issue connecting to the stadium copilot services. Please make sure the GEMINI_API_KEY is configured in your project secrets. Error detail: ${error.message || error}`,
      toolCalls: []
    };
  }
}
