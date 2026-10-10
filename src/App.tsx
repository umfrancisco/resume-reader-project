import { useState } from "react";
import PdfReader from "./components/PdfReader";
import Results from "./components/Results";
import { sendRequestToGeminiApi } from "./services/api";

function App() {
  const [pages, setPages] = useState<string[]>([]);
  const [response, setResponse] = useState<ResponseGemini>();
  const [isWaiting, setIsWaiting] = useState(false);

  return (
    <div className="container">
      {isWaiting ? (
        <div>Loading...</div>
      ) : (
        <>
          <PdfReader 
            pages={pages} 
            setPages={setPages} 
            setIsWaiting={setIsWaiting} 
            setResponse={setResponse} 
            handleRequest={sendRequestToGeminiApi} />
          {response && <Results response={response} />}
        </>
      )}
    </div>
  )
}

export default App;