// server.js
import express from "express";
import { GoogleAuth } from "google-auth-library";
import { v1 } from "@google-cloud/aiplatform";

const app = express();
app.use(express.json());

// ====== Environment Variables ======
const projectId = process.env.GCP_PROJECT_ID;
const location = process.env.GCP_LOCATION || "us-central1";
const modelName = process.env.MODEL_NAME || "gemini-1.5-flash";
const serviceAccountJSON = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

if (!serviceAccountJSON || !projectId) {
  console.error("Missing Google Cloud environment variables!");
  process.exit(1);
}

// ====== Google Auth & Vertex AI Client ======
const auth = new GoogleAuth({
  credentials: JSON.parse(serviceAccountJSON),
  scopes: "https://www.googleapis.com/auth/cloud-platform",
});

const client = new v1.PredictionServiceClient({ auth });

// ====== Test Route ======
app.get("/", (req, res) => {
  res.send("ResumeBot with Vertex AI is running!");
});

// ====== Generate Text Route ======
app.post("/api/generate", async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const request = {
      endpoint: `projects/${projectId}/locations/${location}/publishers/google/models/${modelName}`,
      instances: [{ prompt }],
      parameters: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    };

    const [response] = await client.predict(request);

    // Extract text from response
    const text =
      response.predictions[0].content ||
      response.predictions[0].outputText ||
      "No response from Vertex AI.";

    res.json({ text });
  } catch (err) {
    console.error("Vertex AI generation error:", err);
    res.status(500).json({ error: "Vertex AI generation failed" });
  }
});

// ====== Start Server ======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`ResumeBot backend running on port ${PORT}`)
);
