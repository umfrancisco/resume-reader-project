import { useEffect, useState } from "react";
import PdfReader from "./components/PdfReader";
import Results from "./components/Results";
import { getFromLocalStorage, PdfReaderContext } from "./services/api";

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
    <PdfReaderContext.Provider value={{
      pages,
      setPages,
      setIsWaiting,
      response,
      setResponse,
    }}>
      <div className="container">
        <main className="main-content">
          {isWaiting && <div>Carregando...</div>}
          {!isWaiting && (
            <>
              <PdfReader />
              {response && <Results />}
            </>
          )}
        </main>
      </div>
    </PdfReaderContext.Provider>
  )
}

export default App;