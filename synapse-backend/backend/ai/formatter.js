import OpenAI from "openai"
import dotenv from "dotenv"
dotenv.config()

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
})

export async function formatContent(text) {
  try {
    console.log("📩 Sending text to Groq:", text);

    const systemPrompt = `
You are Synapse AI. Analyze the input content and determine its type: "video", "article", or "product". Return a JSON object only with the following structure based on the type:

1. For type "video":
{
  "type": "video",
  "title": "<title of the video>",
  "url": "<video URL>",
  "description": "<short description or snippet>",
  "image": "<thumbnail URL>"
}

2. For type "article":
{
  "type": "article",
  "title": "<title of the article>",
  "url": "<article URL>",
  "description": "<short summary or snippet>",
  "image": "<main image URL if available>"
}

3. For type "product":
{
  "type": "product",
  "title": "<product title>",
  "url": "<product page URL>",
  "description": "<short description>",
  "price": {
    "original": "<original price>",
    "discounted": "<discounted price if available>"
  },
  "image": "<main image URL>",
  "brand": "<brand name if available>"
}

Important:
- Include the "type" field at the top.
- Only include the relevant fields mentioned above.
- Return valid JSON only, nothing else.
- If a field is not available, set its value to null.
`;

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
    });

    const raw = response.choices[0].message.content;
    console.log("📝 Raw AI Output:\n", raw);

    // Extract JSON from AI response
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn("⚠️ Could not find JSON in AI response.");
      return raw; // fallback: raw text
    }

    const formatted = JSON.parse(jsonMatch[0]);
    return formatted;

  } catch (err) {
    console.error("❌ AI format error:", err.response?.data || err.message);
    return null;
  }
}
