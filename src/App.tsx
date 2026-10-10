import { useEffect, useState } from "react";
import PdfReader from "./components/PdfReader";
import Results from "./components/Results";
import { getFromLocalStorage, sendRequestToGeminiApi } from "./services/api";

function App() {
  const [pages, setPages] = useState<string[]>([]);
  const [response, setResponse] = useState<AiResponse>();
  const [isWaiting, setIsWaiting] = useState(false);
  let saved: AiResponse[] = getFromLocalStorage();

  useEffect(() => {
    if (response) {
      saved.push(response);
      localStorage.setItem("saved", JSON.stringify(saved));
    }
  }, [response]);

  return (
    <div className="container">
      <main className="main-content">
        {isWaiting && <div>Carregando...</div>}
        {!isWaiting && (
          <>
            <PdfReader pages={pages} setPages={setPages} setIsWaiting={setIsWaiting} setResponse={setResponse} handleRequest={sendRequestToGeminiApi} />
            {response && <Results response={response} />}
          </>
        )}
      </main>
    </div>
  )
}

export default App;