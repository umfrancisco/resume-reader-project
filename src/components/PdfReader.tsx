import { useState, type ChangeEvent } from "react";
import { extractPdfText } from "../services/api";

function PdfReader() {
  const [pages, setPages] = useState<string[]>([]);
  const [displayPdfText, setDisplayPdfText] = useState(false);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const extractedPages = await extractPdfText(file);
    setPages(extractedPages);
  }

  function handleDisplay() {
    setDisplayPdfText(d => !d);
  }

  return (
    <div>
      <div className="control-bar">
        <input className="file-input" type="file" accept="application/pdf" onChange={handleFileChange} />
        {pages.length > 0 && (
          <button className="show-text-button" onClick={handleDisplay}>{displayPdfText ? "Hide PDF text" : "Show PDF text"}</button>
        )}
      </div>
      {displayPdfText && (
        <div>
          {pages.map((text, index) => (
            <article key={index} className="page">
              <h4>Page {index + 1}</h4>
              <p>{text}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default PdfReader;