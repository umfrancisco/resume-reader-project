import { useState } from "react";

type Props = {
  pages: string[];
}

function Page({ pages }: Props) {
  const [page, setPage] = useState(0);
  const max = page === pages.length - 1 ? "hide" : "show-text-button";
  const min = page === 0 ? "hide" : "show-text-button";

  if (pages.length > 10) {
    return (
      <div>
        <span>The PDF file is too large. Please try uploading a smaller file.</span>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="buttons">
        <button className={min} onClick={() => setPage(n => n - 1)}>Previous</button>
        <button className={max} onClick={() => setPage(n => n + 1)}>Next</button>
      </div>
      <div className="page-content">
        <h4>Page {page + 1}</h4>
        <p>{pages[page]}</p>
      </div>
    </div>
  )
}

export default Page;