const { generateResponse } = require("../services/llmService");
const { saveInquiry } = require("../services/inquiryService");
const { sendConfirmationEmail } = require("../services/emailService");

const {
    isInquiryIntent,
    hasConversation,
    startConversation,
    saveAnswer,
    endConversation
} = require("../services/inquiryConversation");

async function chat(req, res) {
    try {

        const { message, userId } = req.body;

        if (!message) {
            return res.status(400).json({
                error: "Message is required."
            });
        }

        // Default user if frontend doesn't send one yet
        const currentUser = userId || "default-user";

        // Continue an existing inquiry conversation
        if (hasConversation(currentUser)) {

            const result = saveAnswer(currentUser, message);

            // Ask the next question if inquiry is not complete
            if (result.cancelled) {

    return res.json({
        reply: result.question
    });

}

if (!result.completed) {

    return res.json({
        reply: result.question
    });

}

            // Inquiry completed - save to database
            try {
                console.log("Conversation completed!");
                console.log(result.data);
                await saveInquiry(result.data);
await sendConfirmationEmail(result.data);
                return res.json({
                    reply: "🎉 Thank you! Your inquiry has been submitted successfully. I'll get back to you soon."
                });

            } finally {

                // Always clear conversation
                endConversation(currentUser);

            }
        }

        console.log("Message:", message);
        console.log("Inquiry Intent:", isInquiryIntent(message));

        // Start a new inquiry conversation
        if (isInquiryIntent(message)) {

            const question = startConversation(currentUser);

            return res.json({
                reply: question
            });

        }

        // Normal AI chat
        const reply = await generateResponse(message);

        return res.json({
            reply
        });

    } catch (error) {

        console.error("========== ERROR ==========");
        console.error(error);
        console.error("===========================");

        return res.status(500).json({
            error: error.message || "Failed to generate response."
        });

    }
}

module.exports = { chat };