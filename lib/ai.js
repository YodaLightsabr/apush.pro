class AIError extends Error {
    constructor(message) {
        super(message);
        this.name = "AIError";
    }
}

export default async function ai (messages) {
    if (!Array.isArray(messages)) {
        messages = [{ role: "user", content: messages }];
    }
    const response = await fetch("https://ai.hackclub.com/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messages,
        }),
    });

    if (!response.ok) {
        throw new AIError("Failed to fetch AI response");
    }

    const data = await response.json();
    const choice = data.choices[0];

    if (choice.finish_reason !== "stop") {
        throw new AIError("AI did not finish properly");
    }

    const content = choice.message.content;

    return content;
}