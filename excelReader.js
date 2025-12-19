const ExcelJS = require("exceljs");
const path = require("path");

async function getEntryByAnubandhId(anubandhId, no) {
  const workbook = new ExcelJS.Workbook();
  const excelPath = path.join(__dirname, "uploads", "melava_entry.xlsx");

  await workbook.xlsx.readFile(excelPath);

  const sheet = workbook.worksheets[0];
  const headerRow = sheet.getRow(1);

  // Map headers
  const columns = {};
  headerRow.eachCell((cell, colNumber) => {
    columns[cell.value] = colNumber;
  });

  let result = null;

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1 || result) return;

    const excelAnubandhId = row.getCell(columns["Anubandh ID No."]).value;
    const excelNo = row.getCell(columns["No."]).value;

    const anubandhMatches =
      typeof anubandhId === "string" &&
      excelAnubandhId != null &&
      excelAnubandhId.toString().trim() === anubandhId.trim();

    const noMatches =
      no != null &&
      excelNo != null &&
      excelNo.toString().trim() === no.toString().trim();

    // ✅ OR logic
    if (anubandhMatches || noMatches) {
      result = {
        No: excelNo,
        anubandhId: excelAnubandhId,
        fullName: row.getCell(columns["Full Name"]).value,
        gender: row.getCell(columns["Gender"]).value,
        dob: row.getCell(columns["Date Of Birth"]).value,
        qualification: row.getCell(columns["Qualification"]).value,
        education: row.getCell(columns["Education"]).value,
        occupation: row.getCell(columns["Occupation"]).value,
        income: row.getCell(columns["Annual Income"]).value,
        height: row.getCell(columns["Height"]).value,
        address: row.getCell(columns["Permanent Address"]).value,
        mobile: row.getCell(columns["Mob no."]).value,
        email: row.getCell(columns["Email"]).value,
        gotra1: row.getCell(columns["First Gotra"]).value,
        gotra2: row.getCell(columns["Second Gotra"]).value,
        mamaName: row.getCell(columns["Mama Name"]).value
      };
    }
  });

  return result;
}

module.exports = getEntryByAnubandhId;
