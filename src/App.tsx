import { useState } from "react";
import PdfReader from "./components/PdfReader";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Results from "./components/Results";

function App() {
  const [pages, setPages] = useState<string[]>([]);
  const [response, setResponse] = useState<ResponseGemini>();
  const [isWaiting, setIsWaiting] = useState(false);

  async function sendRequestToGeminiApi() {
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
    } catch (err) {
      alert("ERROR");
    } finally {
      setIsWaiting(false);
    }
  }

  return (
    <div className="container">
      {isWaiting ? (
        <div>Loading...</div>
      ) : (
        <>
          <PdfReader pages={pages} setPages={setPages} handleRequest={sendRequestToGeminiApi} />
          {response && <Results response={response} />}
        </>
      )}
    </div>
  )
}

export default App;