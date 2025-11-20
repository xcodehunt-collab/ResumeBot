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
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are an expert resume writer." },
                    { role: "user", content: `Write a professional ATS-friendly resume for: ${jobTitle}. User info: ${userInput}` }
                ]
            })
        });

        const data = await response.json();

        console.log("OpenAI Response:", data);  // <-- IMPORTANT FOR DEBUGGING

        if (!data.choices || !data.choices[0]?.message?.content) {
            return res.status(500).send({
                error: "OpenAI response missing content",
                raw: data
            });
        }

        const result = data.choices[0].message.content;

        res.send({ resume: result });

    } catch (error) {
        res.status(500).send({
            error: "Server error",
            message: error.message
        });
    }
});
