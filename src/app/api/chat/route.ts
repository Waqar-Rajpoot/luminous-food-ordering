import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";
import { tavily } from "@tavily/core";

// Initialize clients
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY! });

const availableTools = {
  webSearch: webSearch,
};

interface RequestBody {
  message: string;
}

async function webSearch({ query }: { query: string }) {
  // 🟢 This is the log line that WILL print if the function is executed.
  console.log(`✅ Tool successfully called for query: ${query}`);
  try {
    const response = await tvly.search(query);
    const finalResponse = response.results
      .map((result) => result.content)
      .join("\n\n");
    return finalResponse;
  } catch (error) {
    console.error("Tavily Search Error:", error);
    return "An error occurred while searching the web.";
  }
}

async function getGroqCompletion(
  messages: ChatCompletionMessageParam[],
  toolChoice:
    | "auto"
    | "none"
    | { type: "function"; function: { name: string } } = "auto"
) {
  return groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.1,
    messages: messages,
    max_tokens: 1024,
    tools: [
      {
        type: "function",
        function: {
          name: "webSearch",
          description:
            "Search the web for real-time information, news, dates, or specific facts not known by the AI.",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "The specific keyword or question to search for.",
              },
            },
            required: ["query"],
          },
        },
      },
    ],
    // 🟢 Uses the passed toolChoice (either "auto" or explicitly forcing webSearch)
    tool_choice: toolChoice,
  });
}

export async function POST(req: Request) {
  try {
    const { message }: RequestBody = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    // --- NEW: Heuristic to determine if a tool is absolutely required ---
    const realTimeKeywords = [
      "current",
      "latest",
      "launch date",
      "who is the president",
      "price of",
      "today's",
    ];
    const messageLower = message.toLowerCase();

    let toolChoice: any = "auto";

    if (realTimeKeywords.some((keyword) => messageLower.includes(keyword))) {
      // Explicitly force the tool call using the required structured format
      toolChoice = { type: "function", function: { name: "webSearch" } };
      console.log(`🛠️ FORCING webSearch TOOL CALL for query: "${message}"`);
    }

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: `You are Jarvis, a helpful assistant for Luminous Bistro.
                
                TOOL USE RULES:
                - If the user asks about facts/news/dates, use the 'webSearch' tool.
                - CRITICAL: Do NOT generate tool calls as plain text or use XML tags like <function=...>. Use the structured tool call object.`,
      },
      {
        role: "user",
        content: message,
      },
    ];

    // --- Step 1: First API Call (Determine if a tool is needed) ---
    let response;
    try {
      // 🟢 Pass the calculated toolChoice parameter
      response = await getGroqCompletion(messages, toolChoice);
    } catch (error: any) {
      // ... (Error logging remains the same for debugging 400 errors)
      console.error("❌ Groq API Call Failed!");
      if (error?.error?.failed_generation) {
        console.error("⚠️ MODEL HALLUCINATION DETECTED (Model Text Output):");
        console.error(error.error.failed_generation);
      } else {
        console.error("Standard Error:", error);
      }

      return NextResponse.json(
        { error: "AI Service Error", details: error.message },
        { status: 500 }
      );
    }

    const toolCalls = response.choices[0].message?.tool_calls;

    // --- Step 2: Tool Execution ---
    if (toolCalls && toolCalls.length > 0) {
      // 🟢 NEW LOG: Confirmation that the API successfully returned a tool call object
      console.log(
        `✨ Tool Call Object Received! Executing ${toolCalls.length} tool(s)...`
      );

      messages.push(response.choices[0].message);

      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const functionToCall =
          availableTools[functionName as keyof typeof availableTools];

        if (functionToCall) {
          let functionArgs;
          try {
            functionArgs = JSON.parse(toolCall.function.arguments);
          } catch (e) {
            console.error(e);
            console.error(
              "❌ JSON Parse Error for tool args:",
              toolCall.function.arguments
            );
            messages.push({
              tool_call_id: toolCall.id,
              role: "tool",
              content: "Error: Invalid JSON arguments.",
            });
            continue;
          }

          // The log inside webSearch will now print!
          const toolOutput = await functionToCall(functionArgs);

          messages.push({
            tool_call_id: toolCall.id,
            role: "tool",
            content: toolOutput,
          });
        }
      }

      // --- Step 3: Second API Call (Final Answer) ---
      try {
        response = await getGroqCompletion(messages, "auto");
      } catch (error: any) {
        console.error("❌ Groq Second API Call Failed:", error);
        return NextResponse.json(
          { error: "Failed to generate final answer" },
          { status: 500 }
        );
      }
    }

    const aiResponse =
      response.choices[0]?.message?.content ||
      "Sorry, I couldn't get a response.";

    return NextResponse.json({ response: aiResponse }, { status: 200 });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
