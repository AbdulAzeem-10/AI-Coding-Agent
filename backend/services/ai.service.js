import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
    apiKey: process.env.GOOGLE_AI_KEY
});

// Gemini model fallback priority
const CANDIDATE_MODELS = [
    "gemini-flash-latest",
    "gemini-3.6-flash",
    "gemini-3.5-flash-lite",
    "gemini-2.0-flash",
    "gemini-1.5-flash"
];

const systemInstruction = `
You are an expert in MERN and Development. You have an experience of 10 years in development.

You always:
- Write modular and maintainable code.
- Break code into appropriate files and modules.
- Follow development best practices.
- Use understandable comments in the code.
- Create files as needed.
- Maintain the working functionality of previous code.
- Handle edge cases.
- Handle errors and exceptions.
- Write scalable and maintainable code.

Examples:

<example>

user: Create an express application

response: {
    "text": "this is your fileTree structure of the express server",
    "fileTree": {
        "app.js": {
            "file": {
                "contents": "const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});"
            }
        },
        "package.json": {
            "file": {
                "contents": "{ 
    \\"name\\": \\"temp-server\\",
    \\"version\\": \\"1.0.0\\",
    \\"main\\": \\"index.js\\",
    \\"scripts\\": {
        \\"test\\": \\"echo \\\\\\"Error: no test specified\\\\\\" && exit 1\\" 
    },
    \\"keywords\\": [],
    \\"author\\": \\"\\",
    \\"license\\": \\"ISC\\",
    \\"description\\": \\"\\",
    \\"dependencies\\": {
        \\"express\\": \\"^4.21.2\\"
    }
}"
            }
        }
    },
    "buildCommand": {
        "mainItem": "npm",
        "commands": ["install"]
    },
    "startCommand": {
        "mainItem": "node",
        "commands": ["app.js"]
    }
}

</example>

<example>

user: Hello

response: {
    "text": "Hello, How can I help you today?"
}

</example>

IMPORTANT:
Do not use file names like routes/index.js.
`;

export const generateResult = async (prompt) => {

    let lastError = null;

    for (const modelName of CANDIDATE_MODELS) {

        try {

            console.log(`[AI Service] Calling Gemini API with model: ${modelName}`);

            const result = await genAI.models.generateContent({
                model: modelName,
                contents: prompt,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    temperature: 0.4
                }
            });

            if (result && result.text) {

                console.log(
                    `[AI Service] Received response from model ${modelName}`
                );

                return result.text;
            }

        } catch (error) {

            console.warn(
                `[AI Service] Model ${modelName} failed: ${error.message || error}`
            );

            lastError = error;
        }
    }

    throw new Error(
        `All Gemini AI models failed. Last error: ${
            lastError ? lastError.message : "Unknown"
        }`
    );
};