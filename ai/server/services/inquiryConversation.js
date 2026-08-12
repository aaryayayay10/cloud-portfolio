const conversations = {};

const inquirySteps = [
    "full_name",
    "company",
    "email",
    "phone",
    "services",
    "description",
    "budget",
    "timeline"
];

const questions = {
    full_name:
        "Great! Let's get started.\n\nWhat's your full name?\n\n💡 You can type 'stop' at any time to cancel this inquiry.",

    company:
        "Which company are you from?",

    email:
        "What's your email address?",

    phone:
        "What's your phone number? (10 digits)",

    services:
        "Which service are you interested in?\n\nExamples:\n• Full-Time\n• Internship\n• Freelance\n• AI\n• Cloud\n• Web Development",

    description:
        "Could you briefly describe your project or requirement?",

    budget:
        "What's your estimated budget?",

    timeline:
        "What's your expected timeline?"
};

/* ========================================
        INQUIRY DETECTION
======================================== */

function isInquiryIntent(message) {

    const text = message.toLowerCase().trim();

    const inquiryPatterns = [

        "hire aarya",
        "start a project",
        "contact aarya",
        "work together",
        "collaborate",
        "freelance",
        "project",
        "hire",
        "client",
        "need a developer",
        "looking for a developer",
        "build a website",
        "website",
        "web app",
        "ai project",
        "automation",
        "cloud project",
        "technical writing",
        "content writing",
        "internship",
        "full time",
        "full-time",
        "job opportunity",
        "request a quote",
        "book a consultation",
        "reach out",
        "get in touch"

    ];

    return inquiryPatterns.some(pattern =>
        text.includes(pattern)
    );

}

/* ========================================
        CONVERSATION
======================================== */

function hasConversation(userId) {

    return !!conversations[userId];

}

function startConversation(userId) {

    conversations[userId] = {

        step: 0,
        data: {}

    };

    return questions.full_name;

}

function endConversation(userId) {

    delete conversations[userId];

}

/* ========================================
        VALIDATION
======================================== */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}

function isValidPhone(phone) {

    return /^[0-9]{10}$/.test(phone);

}

function isValidBudget(budget) {

    if (!budget) return true;

    return true;

}

/* ========================================
        SAVE ANSWER
======================================== */

function saveAnswer(userId, answer) {

    const conversation = conversations[userId];

    if (!conversation) {

        return null;

    }

    const text = answer.trim().toLowerCase();

    /* -------- Cancel Commands -------- */

    const cancelCommands = [

        "stop",
        "cancel",
        "exit",
        "quit",
        "end",
        "back",
        "go back",
        "never mind",
        "nevermind"

    ];

    if (cancelCommands.includes(text)) {

        endConversation(userId);

        return {

            completed: false,

            cancelled: true,

            question:
                "👍 No problem! I've cancelled the inquiry.\n\nFeel free to continue chatting with me about Aarya's experience, projects, certifications or start a new inquiry anytime by saying **Hire Aarya** or **Start a Project**."

        };

    }

    /* -------- Current Step -------- */

    const field = inquirySteps[conversation.step];

    /* -------- Validation -------- */

    if (field === "email") {

        if (!isValidEmail(answer)) {

            return {

                completed: false,

                question:
                    "❌ That doesn't look like a valid email address.\n\nPlease enter a valid email."

            };

        }

    }

    if (field === "phone") {

        if (!isValidPhone(answer)) {

            return {

                completed: false,

                question:
                    "❌ Please enter a valid 10-digit phone number."

            };

        }

    }

    if (field === "budget") {

        if (!isValidBudget(answer)) {

            return {

                completed: false,

                question:
                    "❌ Please enter a valid budget."

            };

        }

    }

    /* -------- Save Answer -------- */

    conversation.data[field] = answer;

    conversation.step++;

    /* -------- Finished -------- */

    if (conversation.step >= inquirySteps.length) {

        return {

            completed: true,

            data: conversation.data

        };

    }

    /* -------- Next Question -------- */

    return {

        completed: false,

        question:
            questions[inquirySteps[conversation.step]]

    };

}

/* ========================================
        EXPORTS
======================================== */

module.exports = {

    isInquiryIntent,

    hasConversation,

    startConversation,

    saveAnswer,

    endConversation

};