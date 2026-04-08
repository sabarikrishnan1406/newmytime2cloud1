const express = require("express");
const cors = require("cors");
const path = require("path");
const puppeteer = require("puppeteer");

const app = express();
app.use(cors({ origin: "*", methods: ["GET", "POST", "OPTIONS"], allowedHeaders: ["Content-Type"] }));
app.use(express.json({ limit: "10mb" }));
app.use("/templates", express.static(path.resolve(__dirname, "..", "summary-report")));

app.post("/pdf", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "url is required" });

  console.log("Generating PDF for:", url);
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-web-security"],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    // Log errors for debugging
    page.on("pageerror", (err) => console.log("PAGE ERROR:", err.message));
    page.on("requestfailed", (req) => console.log("FAILED REQUEST:", req.url()));

    console.log("Loading page...");
    await page.goto(url, { waitUntil: "networkidle0", timeout: 120000 });
    console.log("Page loaded (networkidle0)");

    // Wait for table to appear (means data has loaded and rendered)
    try {
      await page.waitForSelector("table tbody tr", { timeout: 30000 });
      console.log("Table rows found");
    } catch (e) {
      console.log("No table rows found, waiting extra time...");
    }

    // Extra wait for any animations/transitions
    await new Promise((r) => setTimeout(r, 2000));

    // Check what's on the page
    const info = await page.evaluate(() => {
      const tables = document.querySelectorAll("table");
      const rows = document.querySelectorAll("table tbody tr");
      const body = document.body;
      return {
        tables: tables.length,
        rows: rows.length,
        bodyHeight: body.scrollHeight,
        bodyWidth: body.scrollWidth,
        title: document.title,
        rootHTML: document.getElementById("root")?.innerHTML?.substring(0, 200) || "EMPTY",
      };
    });
    console.log("Page info:", JSON.stringify(info));

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "5mm", bottom: "5mm", left: "5mm", right: "5mm" },
    });

    console.log("PDF generated:", pdf.length, "bytes");
    res.set({ "Content-Type": "application/pdf", "Content-Disposition": "attachment" });
    res.send(pdf);
  } catch (err) {
    console.error("PDF error:", err.message);
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

const PORT = 3002;
app.listen(PORT, () => console.log(`PDF service running on http://localhost:${PORT}`));
