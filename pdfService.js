const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const formatDateToPdf = require("./utils/date"); // adjust path if needed

async function generateExactPdf(data, res) {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage"
      ]
    });

    const page = await browser.newPage();

    let html = fs.readFileSync(
      path.join(__dirname, "templates/pdf.html"),
      "utf8"
    );

    html = html
      .replace("{{NO}}", data.No)
      .replaceAll("{{ANUBANDH_ID}}", data.anubandhId)
      .replace("{{GENDER}}", data.gender)
      .replace("{{QUALIFICATION}}", data.qualification)
      .replace("{{FULL_NAME}}", data.fullName)
      .replace("{{DOB}}", formatDateToPdf(data.dob))
      .replace("{{EMAIL}}", data.email)
      .replace("{{EDUCATION}}", data.education)
      .replace("{{OCCUPATION}}", data.occupation || "")
      .replace("{{INCOME}}", data.income)
      .replace("{{GOTRA1}}", data.gotra1)
      .replace("{{GOTRA2}}", data.gotra2)
      .replace("{{HEIGHT}}", data.height)
      .replace("{{PERM_ADDRESS}}", data.address)
      .replace("{{CURR_ADDRESS}}", data.address)
      .replace("{{MOBILE}}", data.mobile)
      .replace("{{CONTACT_NAME}}", data.fullName)
      .replace("{{CONTACT_MOBILE}}", "9822567686")
      .replace("{{MAMA_NAME}}", data.mamaName);

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${data.No}.pdf`
    );

    return res.send(pdfBuffer);

  } catch (err) {
    console.error("❌ PDF generation failed:", err);
    return res.status(500).json({
      message: "PDF generation failed",
      error: err.message
    });
  }
}

module.exports = generateExactPdf;
