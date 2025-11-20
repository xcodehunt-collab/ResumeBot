<script>
async function generateResume(prompt) {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (data.text) {
      document.getElementById("result").innerText = data.text;
    } else {
      document.getElementById("result").innerText =
        "No response from Vertex AI.";
    }
  } catch (err) {
    console.error(err);
    document.getElementById("result").innerText =
      "Error generating resume.";
  }
}

// Example usage
document.getElementById("generateBtn").addEventListener("click", () => {
  const prompt = document.getElementById("promptInput").value;
  generateResume(prompt);
});
</script>

<input id="promptInput" type="text" placeholder="Enter your prompt" />
<button id="generateBtn">Generate Resume</button>
<div id="result"></div>
