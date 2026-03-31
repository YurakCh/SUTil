import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';

async function readPdf(pdfPath) {
  try {
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const doc = await pdfjsLib.getDocument({ data }).promise;

    let fullText = "";
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const textContent = await page.getTextContent();
      
      // Keep track of the actual text string to see its layout, some SUT documents
      // are rendered item by item on the exact same Y coordinate.
      const pageText = textContent.items
          .map(item => item.str)
          .join('\n');
      
      fullText += `\n--- PAGE ${i} ---\n` + pageText;
    }

    fs.writeFileSync('pdf-output.txt', fullText);
    console.log("PDF text extracted and saved to pdf-output.txt");
  } catch (err) {
    console.error("Error reading PDF:", err);
  }
}

const file = 'c:\\Users\\yurak\\Desktop\\SUT-YA\\R.U.C._ 1792388333001 N° DE FORMULARIO_ DT02224207.pdf';
readPdf(file);
