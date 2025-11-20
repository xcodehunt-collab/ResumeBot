document.getElementById("generateBtn").addEventListener("click", async () => {
  const prompt = document.getElementById("prompt").value.trim();
  const resultEl = document.getElementById("result");

  if (!prompt) {
    resultEl.textContent = "Please enter a prompt.";
    return;
  }

  resultEl.textContent = "Generating...";

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    if (data.text) {
      resultEl.textContent = data.text;
    } else {
      resultEl.textContent = "No response from server.";
    }
  } catch (err) {
    console.error(err);
    resultEl.textContent = "Error calling server.";
  }
});
