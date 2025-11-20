const userInputEl = document.getElementById("userInput");
const jobTitleEl = document.getElementById("jobTitle");
const generateBtn = document.getElementById("generateBtn");
const outputEl = document.getElementById("output");
const downloadPdfBtn = document.getElementById("downloadPdf");

generateBtn.addEventListener("click", async () => {
    const userInput = userInputEl.value.trim();
    const jobTitle = jobTitleEl.value.trim();

    if (!userInput || !jobTitle) {
        outputEl.innerText = "❌ Enter both job title and user details.";
        return;
    }

    outputEl.innerText = "⏳ Generating resume...";

    try {
        const response = await fetch("/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userInput, jobTitle })
        });

        const data = await response.json();

        if (data.error) {
            outputEl.innerText = "❌ Error: " + data.error;
            console.error(data);
            return;
        }

        outputEl.innerText = data.resume;
    } catch (err) {
        outputEl.innerText = "❌ Network or server error";
        console.error(err);
    }
});

downloadPdfBtn.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const text = outputEl.innerText;

    if (!text) {
        alert("Generate resume first!");
        return;
    }

    const lines = pdf.splitTextToSize(text, 180);
    pdf.text(lines, 10, 10);
    pdf.save("resume.pdf");
});
