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

export async function sendRequestToGeminiApi({ pages, setPages, setIsWaiting, setResponse }: HandleRequestProps) {
  let text = "";
  pages.forEach(page => text += page);

  setIsWaiting(true);

  const context = `
    Analise o currículo profissional abaixo e sugira melhorias para torná-lo mais claro, atrativo e competitivo no mercado de trabalho.

    **Currículo do usuário:**
    ${text}

    **Instruções:**
    1. Identifique o nome do candidato e sua profissão ou área de atuação principal com base nas informações disponíveis.
    2. Avalie o currículo considerando aspectos como:
      - Clareza e objetividade das informações.
      - Qualidade da descrição das experiências profissionais e dos projetos.
      - Adequação das competências técnicas e comportamentais à área de atuação.
      - Organização e consistência das informações.
      - Uso de palavras-chave relevantes para sistemas ATS (Applicant Tracking Systems).
      - Oportunidades de destacar resultados, realizações e diferenciais profissionais.
    3. Apresente sugestões específicas, práticas e prioritárias, considerando o nível de experiência do candidato e sua área de atuação.
    4. Evite recomendações genéricas. Sempre que possível, indique o que deve ser melhorado e por quê.
    5. Não invente informações, experiências, qualificações ou resultados que não estejam presentes no currículo.
    6. Considere apenas as informações fornecidas, sem presumir dados ausentes.
    7. Escreva todas as sugestões em português brasileiro, utilizando linguagem profissional e acessível.
    8. Retorne exclusivamente um objeto JSON válido, sem blocos Markdown, comentários ou texto adicional, seguindo exatamente esta estrutura:

    {
      "nome_usuario": "string",
      "profissao": "string",
      "sugestoes": [
        "string"
      ]
    }

    **Regras para o JSON:**
    - nome_usuario: nome completo do candidato, se identificado; caso contrário, utilize "Não identificado".
    - profissao: profissão ou área de atuação principal identificada; caso não seja possível determiná-la, utilize "Não identificada".
    - sugestoes: array de strings contendo as melhorias recomendadas, ordenadas da mais importante para a menos importante.
    - Inclua entre 5 e 10 sugestões, desde que haja informações suficientes para justificá-las.
    - Cada sugestão deve abordar um aspecto específico do currículo.
    - Escape corretamente caracteres especiais e quebras de linha para garantir que a resposta seja um JSON válido.
    - Não inclua propriedades além das três especificadas.
  `;

  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
    });
    const res = await model.generateContent(context);
    setResponse(JSON.parse(res.response.text()));
    setPages([]);
  } catch (err) {
    console.log(err);
    alert("ERROR");
  } finally {
    setIsWaiting(false);
  }
}