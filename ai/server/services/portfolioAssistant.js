const { generateResponse } = require("./groqService");

async function generatePortfolioResponse(message) {
  try {
    const reply = await generateResponse(message);
    return reply;
  } catch (error) {
    console.error("Portfolio Assistant Error:", error);
    throw error;
  }
}

module.exports = { generateResponse: generatePortfolioResponse };

