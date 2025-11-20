import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/generate", async (req, res) => {
    const { userInput, jobTitle } = req.body;

    if (!userInput || !jobTitle) {
        return res.status(400).send({ error: "Job title and user input required" });
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are an expert resume writer." },
                    { role: "user", content: `Create a clean, professional, ATS-friendly resume for the role: ${jobTitle}. Include user's info: ${userInput}` }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();

        console.log("Raw OpenAI Response:", JSON.stringify(data, null, 2));

        if (!data.choices || !data.choices[0] || !data.choices[0].message?.content) {
            return res.status(500).send({
                error: "OpenAI response missing content",
                raw: data
            });
        }

        res.send({ resume: data.choices[0].message.content });

    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Server error", message: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
