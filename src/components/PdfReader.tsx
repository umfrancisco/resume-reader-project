import { useState, type ChangeEvent } from "react";
import { extractPdfText } from "../services/api";

function PdfReader() {
  const [pages, setPages] = useState<string[]>([]);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const extractedPages = await extractPdfText(file);
    setPages(extractedPages);
  }

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      {pages.map((text, index) => (
        <article key={index} className="page">
          <h4>Page {index + 1}</h4>
          <p>{text}</p>
        </article>
      ))}
    </div>
  )
}

export default PdfReader;