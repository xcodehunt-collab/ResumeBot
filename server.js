// server.js
import express from "express";
import path from "path";
import { GoogleAuth } from "google-auth-library";
import { v1 } from "@google-cloud/aiplatform";

const app = express();
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(process.cwd(), "public")));

// ===== Environment Variables =====
const projectId = process.env.GCP_PROJECT_ID;
const location = process.env.GCP_LOCATION || "us-central1";
const modelName = process.env.MODEL_NAME || "gemini-1.5-flash";
const serviceAccountJSON = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

if (!serviceAccountJSON || !projectId) {
  console.error("⚠️ Missing Google Cloud environment variables!");
  process.exit(1);
}

// ===== Google Auth & Vertex AI Client =====
const auth = new GoogleAuth({
  credentials: JSON.parse(serviceAccountJSON),
  scopes: "https://www.googleapis.com/auth/cloud-platform",
});

const client = new v1.PredictionServiceClient({ auth });

// ===== Generate Resume Route =====
app.post("/api/generate", async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const request = {
      endpoint: `projects/${projectId}/locations/${location}/publishers/google/models/${modelName}`,
      instances: [{ prompt }],
      parameters: { temperature: 0.7, maxOutputTokens: 1024 },
    };

    const [response] = await client.predict(request);

    console.log("Vertex AI Raw Response:", JSON.stringify(response, null, 2));

    // Safely extract the generated text
    let text = "No response from Vertex AI.";
    if (response.predictions?.[0]?.content) {
      text = response.predictions[0].content;
    } else if (response.predictions?.[0]?.outputText) {
      text = response.predictions[0].outputText;
    } else if (response.predictions?.[0]?.outputs?.[0]?.text) {
      text = response.predictions[0].outputs[0].text;
    }

    res.json({ text });
  } catch (err) {
    console.error("Vertex AI Error:", err);
    res.status(500).json({ error: "Vertex AI generation failed" });
  }
});

// ===== Start Server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 ResumeBot server running on port ${PORT}`);
});
