const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");

generateBtn.addEventListener("click", async () => {
    const userInput = document.getElementById("userInput").value;
    const jobTitle = document.getElementById("jobTitle").value;
    const output = document.getElementById("output");
    output.innerText = "Generating...";

    try {
        const response = await fetch("https://resumebot-api.onrender.com/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: userInput, job: jobTitle })
        });

        const data = await response.json();
        output.innerText = data.resume;
    } catch (error) {
        output.innerText = "Error generating resume. Please try again.";
        console.error(error);
    }
});

downloadBtn.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const content = document.getElementById("output").innerText;
    doc.text(content, 10, 10);
    doc.save("ResumeBot_Resume.pdf");
});
