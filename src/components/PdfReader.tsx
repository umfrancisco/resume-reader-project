import { useState, type ChangeEvent, type Dispatch } from "react";
import { extractPdfText } from "../services/api";
import Page from "./Page";

type Props = {
  pages: string[];
  setPages: Dispatch<React.SetStateAction<string[]>>;
  setIsWaiting: Dispatch<React.SetStateAction<boolean>>;
  setResponse: Dispatch<React.SetStateAction<AiResponse | undefined>>;
  handleRequest: (args: HandleRequestProps) => void;
}

function PdfReader({ pages, setPages, setIsWaiting, setResponse, handleRequest }: Props) {
  const [displayPdfText, setDisplayPdfText] = useState(false);
  const [jobDescription, setJobDescription] = useState("");

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
          <form className={pages.length > 10 ? "hide" : ""} onSubmit={(e) => handleRequest({ e, pages, jobDescription, setPages, setIsWaiting, setResponse })}>
            <input className="text-input" type="text" required placeholder="Descrição da vaga" value={jobDescription} onChange={e => setJobDescription(e.target.value)} />
            <button className="show-text-button margin-button" type="button" onClick={handleDisplay}>{displayPdfText ? "Esconder PDF" : "Mostrar PDF"}</button>
            <button className="show-text-button" type="submit">Enviar</button>
          </form>
        )}
      </div>
      {displayPdfText && (
        <Page pages={pages} />
      )}
    </div>
  )
}

export default PdfReader;