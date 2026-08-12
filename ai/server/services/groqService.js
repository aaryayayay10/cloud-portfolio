const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const portfolioData = require("../data/portfolio");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function generateResponse(message) {

    console.log("generateResponse called");
    console.log("Message:", message);

    const prompt = `
${portfolioData}

User Question:
${message}
`;

    console.log("Prompt created.");

    try {

        console.log("Calling Gemini...");

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        console.log("Response received:", response);

        return response.text;

    } catch (error) {

        console.error("=========== GEMINI ERROR ===========");
        console.error(error);
        console.error("====================================");

        throw error;
    }
}

module.exports = { generateResponse };