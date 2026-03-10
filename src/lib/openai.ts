import OpenAI from "openai";

const openai = new OpenAI();

export async function chat(
  system: string,
  user: string,
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  return response.choices[0]?.message?.content ?? "";
}
