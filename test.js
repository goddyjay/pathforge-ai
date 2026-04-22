import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function testClaude() {
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `
Return ONLY valid JSON.
Do NOT include markdown.
Do NOT include explanations.

Give me 2 career paths for a 20-year-old in Nigeria.

Format:
{
  "career_paths": [
    {
      "title": "",
      "description": "",
      "steps": [],
      "avg_monthly_income_ngn": "",
      "time_to_first_job": ""
    }
  ]
}
`
        }
      ]
    });

    console.log("RAW RESPONSE:");
    console.log(response.content[0].text);

  } catch (error) {
    console.error("ERROR:", error);
  }
}

testClaude();
