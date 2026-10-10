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

export async function sendRequestToGeminiApi({ e, pages, jobDescription, setPages, setIsWaiting, setResponse }: HandleRequestProps) {
  e.preventDefault();

  let text = "";
  pages.forEach(page => text += page);

  setIsWaiting(true);

  const context = `
  Analise o currículo profissional abaixo e avalie sua compatibilidade com a vaga desejada. Identifique os pontos fortes, as lacunas em relação aos requisitos da vaga e as melhorias que podem aumentar a competitividade do candidato no processo seletivo.

  **Currículo do candidato:**
  ${text}

  **Descrição da vaga:**
  ${jobDescription}

  **Instruções:**

  1. Identifique o nome completo do candidato e sua profissão ou área de atuação principal com base exclusivamente nas informações disponíveis no currículo.

  2. Avalie a compatibilidade entre o currículo e a vaga, considerando os seguintes critérios:
    - **Competências técnicas:** correspondência entre as tecnologias, ferramentas, linguagens de programação e conhecimentos exigidos pela vaga e aqueles demonstrados no currículo.
    - **Experiência profissional:** aderência das experiências profissionais, acadêmicas e práticas aos requisitos e às responsabilidades da posição.
    - **Projetos relevantes:** relação entre os projetos apresentados no currículo e as atividades descritas na vaga.
    - **Formação acadêmica e qualificações:** atendimento aos requisitos de escolaridade, cursos, certificações e outras qualificações explicitamente mencionadas.
    - **Competências comportamentais:** evidências de habilidades interpessoais e profissionais solicitadas na descrição da vaga.
    - **Palavras-chave e compatibilidade com ATS:** presença de termos relevantes para sistemas de rastreamento de candidatos, sem recomendar a inclusão de competências que o candidato não possui.
    - **Nível de senioridade:** compatibilidade entre o nível de experiência demonstrado e o nível exigido pela vaga.

  3. Calcule uma pontuação de compatibilidade de 0 a 100, considerando a relevância e a importância de cada requisito para a posição. Utilize os seguintes parâmetros como referência:
    - 90-100: compatibilidade muito alta; o currículo demonstra forte aderência à maioria dos requisitos relevantes.
    - 75-89: compatibilidade alta; o candidato atende a grande parte dos requisitos, com algumas lacunas.
    - 50-74: compatibilidade moderada; existem correspondências relevantes, mas também lacunas importantes.
    - 25-49: compatibilidade baixa; o currículo demonstra aderência limitada aos requisitos da vaga.
    - 0-24: compatibilidade muito baixa; há poucas evidências de correspondência com os requisitos apresentados.

  4. Baseie a pontuação em evidências concretas do currículo e na descrição da vaga. Não atribua pontos apenas pela presença de palavras-chave sem considerar seu contexto e sua relevância.

  5. Diferencie a ausência de uma informação no currículo da ausência comprovada de uma competência. Se uma habilidade ou experiência não estiver mencionada, considere-a uma lacuna de evidência, e não uma prova de que o candidato não a possui.

  6. Considere os requisitos obrigatórios mais importantes do que os desejáveis. Leve em conta requisitos eliminatórios explicitamente descritos, quando houver, sem presumir que um requisito seja eliminatório se isso não estiver indicado.

  7. Identifique os principais pontos fortes do candidato em relação à vaga e priorize as lacunas que mais podem prejudicar sua candidatura.

  8. Apresente de 5 a 10 sugestões específicas, práticas e priorizadas para melhorar o currículo em relação à vaga, desde que existam informações suficientes para justificá-las. Se houver menos oportunidades de melhoria fundamentadas, apresente apenas as pertinentes.

  9. Cada sugestão deve:
    - Indicar o que deve ser alterado, incluído, removido ou destacado.
    - Explicar brevemente por que a mudança pode melhorar a compatibilidade com a vaga.
    - Referenciar, sempre que possível, um requisito da vaga ou uma informação já presente no currículo.
    - Priorizar mudanças de maior impacto para o processo seletivo.
    - Recomendar a inclusão de palavras-chave relevantes somente quando forem sustentadas pelas informações fornecidas.

  10. Considere melhorias na apresentação do resumo profissional, nas experiências, nos projetos, nas competências técnicas, na formação acadêmica e nas palavras-chave, conforme a necessidade identificada.

  11. Não invente informações, experiências, resultados, métricas, tecnologias dominadas, qualificações ou competências. Não recomende apresentar uma habilidade como adquirida se isso não estiver comprovado pelas informações fornecidas.

  12. Não penalize excessivamente candidatos iniciantes pela ausência de experiência profissional formal quando a vaga aceitar profissionais júnior ou considerar projetos pessoais, acadêmicos e colaborativos como evidências relevantes.

  13. Avalie exclusivamente a compatibilidade profissional entre o currículo e a vaga. Não utilize características pessoais irrelevantes para o desempenho profissional nem faça inferências sobre atributos que não estejam explicitamente informados.

  14. Escreva todas as sugestões em português brasileiro, com linguagem profissional, objetiva e acessível.

  15. Retorne exclusivamente um objeto JSON válido, sem blocos Markdown, comentários ou texto adicional, seguindo exatamente esta estrutura:

  {
    "nome_usuario": "string",
    "profissao": "string",
    "compatibilidade_vaga": 0,
    "sugestoes": [
      "string"
    ]
  }

  **Regras para o JSON:**

  - nome_usuario: nome completo do candidato, se identificado; caso contrário, utilize "Não identificado".
  - profissao: profissão ou área de atuação principal identificada no currículo; caso não seja possível determiná-la, utilize "Não identificada".
  - compatibilidade_vaga: número inteiro entre 0 e 100, sem símbolo de porcentagem, representando a compatibilidade estimada entre o currículo e a vaga.
  - sugestoes: array de strings contendo recomendações específicas, fundamentadas e ordenadas da mais importante para a menos importante.
  - As sugestões devem contemplar, quando pertinente, tanto os pontos fortes a destacar quanto as lacunas a corrigir.
  - Não inclua propriedades além das quatro especificadas.
  - Utilize aspas duplas em todas as chaves e strings.
  - Escape corretamente aspas, barras invertidas e caracteres de controle.
  - Não inclua vírgulas finais nem qualquer conteúdo fora do objeto JSON.
  - Garanta que a resposta possa ser interpretada diretamente por um parser JSON.
  `;

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