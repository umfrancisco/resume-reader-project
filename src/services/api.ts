import { GoogleGenerativeAI } from "@google/generative-ai";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export async function extractPdfText(file: File) {
  const data = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const pages = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    const text = content.items
      .filter(item => "str" in item)
      .map(item => item.str)
      .join(" ");

    pages.push(text);
  }

  return pages;
}

export async function sendRequestToGeminiApi(
  pages: string[],
  setPages: (arr: string[]) => void,
  setIsWaiting: (val: boolean) => void, 
  setResponse: (val: ResponseGemini) => void) {
  let text = "";
  pages.forEach(page => text += page);

  setIsWaiting(true);

  const context = `
      Curriculo do usuário: ${text};
      Sugira melhorias;
      Retorne apenas um objeto JSON: nome_usuario: string, profissao: string, sugestoes: string[];
    `;

  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
    });
    const res = await model.generateContent(context);
    const str = res.response.text();
    const size = res.response.text().length;
    const obj = JSON.parse(str.substring(7, size - 3));
    console.log(obj);
    setResponse(obj);
    setPages([]);
  } catch (err) {
    alert("ERROR");
  } finally {
    setIsWaiting(false);
  }
}