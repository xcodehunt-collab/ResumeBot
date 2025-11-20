import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.post("/generate", async (req, res) => {
    const { userInput, jobTitle } = req.body;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4.1",
                messages: [
                    { role: "system", content: "You are an expert resume writer." },
                    { role: "user", content: `Create a clean, ATS-friendly professional resume for the role: ${jobTitle}. User details: ${userInput}` }
                ]
            })
        });

        const data = await response.json();
        const result = data.choices[0].message.content;

        res.send({ resume: result });

    } catch (error) {
        res.status(500).send({ error: "AI generation failed." });
    }
});

app.listen(3000, () => console.log("✅ Server running on port 3000"));
