export const downloadReport = async (reportUrl, fileName = "Daily-Summary-Report.pdf") => {
    let objectUrl = null;

    try {
        const response = await fetch("https://report.mytime2cloud.com/pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: reportUrl })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server responded with ${response.status}: ${errorText || 'Failed to generate PDF'}`);
        }

        const blob = await response.blob();

        // 1. Create the URL and the link element
        objectUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = objectUrl;
        link.download = fileName;

        // 2. Append to body (required for some browsers like Firefox)
        document.body.appendChild(link);
        link.click();

        // 3. Clean up the DOM
        document.body.removeChild(link);

    } catch (err) {
        console.error("Report Download Error:", err);
        // Better to use a UI notification system than a blocking alert()
        alert(`Download failed: ${err.message}`);
    } finally {
        // 4. Critical: Free up memory once the download is triggered
        if (objectUrl) {
            // Short delay ensures the browser has started the download before revoking
            setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
        }
    }
};