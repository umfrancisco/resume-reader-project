declare type ResponseGemini = {
  nome_usuario: string;
  profissao: string;
  sugestoes: string[];
}

declare type HandleRequest = (
  pages: string[],
  setPages: (arr: string[]) => void,
  setIsWaiting: (val: boolean) => void,
  setResponse: (val: ResponseGemini) => void
) => void;