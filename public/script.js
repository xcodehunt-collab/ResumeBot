document.getElementById("generateBtn").onclick = async () => {
    const userInput = document.getElementById("userInput").value;
    const jobTitle = document.getElementById("jobTitle").value;
    const output = document.getElementById("output");

    output.innerText = "⏳ Generating resume...";

    const response = await fetch("/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput, jobTitle })
    });

    const data = await response.json();
    output.innerText = data.resume;
};

document.getElementById("downloadPdf").onclick = () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    pdf.text(document.getElementById("output").innerText, 10, 10);
    pdf.save("resume.pdf");
};
