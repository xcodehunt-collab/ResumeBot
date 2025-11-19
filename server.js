import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/generate", async (req, res) => {
    const { text, job } = req.body;

    const prompt = `
Create a professional, ATS-friendly resume based on:
${text}
Target Job Title: ${job}
Format with bullet points, action verbs, measurable achievements.
`;

    const result = await client.chat.completions.create({
        model: "gpt-4.1",
        messages: [{ role: "user", content: prompt }]
    });

    res.json({ resume: result.choices[0].message.content });
});

app.listen(3000, () => console.log("ResumeBot backend running on port 3000"));
