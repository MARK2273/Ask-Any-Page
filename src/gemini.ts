import { GoogleGenerativeAI } from '@google/generative-ai';

export const askGemini = async (pageContent: string, question: string, apiKey: string): Promise<string> => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
You are a helpful assistant analyzing the content of a specific webpage.
Here is the extracting text content from the page:
"""
${pageContent}
"""

User Question: "${question}"

Instructions:
1. Answer the user's question based ONLY on the provided page content.
2. If the answer is not in the text, state that you cannot find the information on this page.
3. Be concise and direct.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message.includes('API key')) {
      throw new Error("Invalid API Key. Please check your key in the extension settings.");
    }
    throw new Error("Failed to get response from Gemini. Please try again.");
  }
};
