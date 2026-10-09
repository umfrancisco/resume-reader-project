import { useState, type ChangeEvent } from "react";
import { extractPdfText } from "../services/api";
import Page from "./Page";

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
    handleDisplay();
  }

  function handleDisplay() {
    setDisplayPdfText(d => !d);
  }

  return (
    <div>
      <div className="control-bar">
        <input className="file-input" type="file" accept="application/pdf" onChange={handleFileChange} />
        {pages.length > 0 && (
          <div className={pages.length > 10 ? "hide" : ""}>
            <button className="show-text-button" onClick={handleDisplay}>{displayPdfText ? "Hide PDF text" : "Show PDF text"}</button>
            <button className="show-text-button" onClick={() => alert("hello world")}>Submit</button>
          </div>
        )}
      </div>
      {displayPdfText && (
        <Page pages={pages} />
      )}
    </div>
  )
}

export default PdfReader;