import { useContext, useState, type ChangeEvent } from "react";
import { extractPdfText, getPrompt, PdfReaderContext } from "../services/api";
import Page from "./Page";
import { GoogleGenerativeAI } from "@google/generative-ai";

function PdfReader() {
  const [displayPdfText, setDisplayPdfText] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const { pages, setPages, setResponse, setIsWaiting } = useContext(PdfReaderContext);

  async function sendRequestToGeminiApi(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
  
    let text = "";
    pages.forEach(page => text += page);
  
    setIsWaiting(true);
  
    const context = getPrompt(text, jobDescription);
  
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-3.1-flash-lite",
      });
      const res = await model.generateContent(context);
      console.log(res.response.text());
      setResponse(JSON.parse(res.response.text()));
      setPages([]);
    } catch (err) {
      console.log(err);
      alert("ERROR");
    } finally {
      setIsWaiting(false);
    }
  }

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
          <form className={pages.length > 10 ? "hide" : ""} onSubmit={(e) => sendRequestToGeminiApi(e)}>
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