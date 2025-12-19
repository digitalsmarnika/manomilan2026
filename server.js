const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const getEntryByAnubandhId = require("./excelReader");
const generateExactPdf = require("./pdfService");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/**
 * UI PAGE
 */
app.get("/", (req, res) => {
  res.render("download");
});

/**
 * POST – Download PDF
 */
app.get("/download", async (req, res) => {
  const { anubandhId, no } = req.query;

  if (!anubandhId && !no) {
    return res.status(400).send("Anubandh ID or No. is required");
  }

  const data = await getEntryByAnubandhId(anubandhId, no);

  if (!data) {
    return res.status(404).send("Record not found");
  }

  await generateExactPdf(data, res);
});


app.listen(3000, () => {
  console.log("✅ PDF server running on http://localhost:3000");
});
