import { useState } from "react";
import PdfReader from "./components/PdfReader";

function App() {
  const [displayPdfText, setDisplayPdfText] = useState(false);

  return (
    <div className="container">
      <PdfReader />
    </div>
  )
}

export default App;