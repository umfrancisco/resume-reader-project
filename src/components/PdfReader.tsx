import { useState, type ChangeEvent, type Dispatch } from "react";
import { extractPdfText } from "../services/api";
import Page from "./Page";

type Props = {
  pages: string[];
  setPages: Dispatch<React.SetStateAction<string[]>>;
  setIsWaiting: Dispatch<React.SetStateAction<boolean>>;
  setResponse: Dispatch<React.SetStateAction<ResponseGemini | undefined>>;
  handleRequest: (args: HandleRequestProps) => void;
}

function PdfReader({ pages, setPages, setIsWaiting, setResponse, handleRequest }: Props) {
  const [displayPdfText, setDisplayPdfText] = useState(false);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const extractedPages = await extractPdfText(file);
    setPages(extractedPages);
    setResponse(undefined);
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
            <button className="show-text-button" onClick={() => handleRequest({ pages, setPages, setIsWaiting, setResponse })}>Submit</button>
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