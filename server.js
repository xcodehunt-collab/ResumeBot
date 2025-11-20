import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Serve frontend
app.use(express.static("public"));
app.use(express.json());

// POST /generate endpoint
app.post("/generate", async (req, res) => {
    const { userInput, jobTitle } = req.body;

    if (!userInput || !jobTitle) {
        return res.status(400).send({ error: "Job title and user input required" });
    }

    try {
        // Call OpenAI API
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are a professional resume writer." },
                    { role: "user", content: `Create an ATS-friendly, professional resume for the role: ${jobTitle}. User details: ${userInput}` }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();

        // DEBUG LOG
        console.log("OpenAI Response:", JSON.stringify(data, null, 2));

        // Validate response
        if (!data.choices || !data.choices[0] || !data.choices[0].message?.content) {
            return res.status(500).send({
                error: "OpenAI response missing content",
                raw: data
            });
        }

        // Send the generated resume to frontend
        res.send({ resume: data.choices[0].message.content });

    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Server error", message: err.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
