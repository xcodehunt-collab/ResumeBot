// DOM Elements
const userInputEl = document.getElementById("userInput");
const jobTitleEl = document.getElementById("jobTitle");
const generateBtn = document.getElementById("generateBtn");
const outputEl = document.getElementById("output");
const downloadPdfBtn = document.getElementById("downloadPdf");

// Generate Resume Button Click
generateBtn.addEventListener("click", async () => {
    const userInput = userInputEl.value.trim();
    const jobTitle = jobTitleEl.value.trim();

    if (!userInput || !jobTitle) {
        outputEl.innerText = "❌ Please enter both job title and your experience/skills.";
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
            console.error("Server Error:", data);
            return;
        }

        if (!data.resume) {
            outputEl.innerText = "❌ Resume generation failed. Check server logs.";
            console.error("Unexpected Response:", data);
            return;
        }

        // Display the generated resume
        outputEl.innerText = data.resume;

    } catch (err) {
        outputEl.innerText = "❌ Network or server error. Check console.";
        console.error(err);
    }
});

// Download PDF Button Click
downloadPdfBtn.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    const text = outputEl.innerText;
    if (!text || text.trim() === "") {
        alert("Please generate a resume first!");
        return;
    }

    // Split long text into lines that fit the page
    const lines = pdf.splitTextToSize(text, 180);
    pdf.text(lines, 10, 10);
    pdf.save("resume.pdf");
});
