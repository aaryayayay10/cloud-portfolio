require("dotenv").config();

const Groq = require("groq-sdk");

const portfolioData = require("../data/portfolio");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function generateResponse(message) {

    console.log("========== LLM SERVICE ==========");
    console.log("Message:", message);

    try {

        console.log("Creating Groq request...");

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",

            messages: [
                {
                    role: "system",
                    content: `
You are Aarya Kadam's Personal AI Portfolio Assistant.

Portfolio Information:

${portfolioData}
`
                },
                {
                    role: "user",
                    content: message
                }
            ]
        });

        console.log("Groq response received.");

        console.log(completion);

        return completion.choices[0].message.content;

    } catch (error) {

        console.log("========== GROQ ERROR ==========");
        console.log(error);
        console.log("===============================");

        throw error;

    }
}

module.exports = {
    generateResponse
};