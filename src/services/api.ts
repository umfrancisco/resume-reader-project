import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { useState, type ChangeEvent } from "react";

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