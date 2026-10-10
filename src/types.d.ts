declare type ResponseGemini = {
  nome_usuario: string;
  profissao: string;
  sugestoes: string[];
}

declare type HandleRequestProps = {
  pages: string[];
  setPages: Dispatch<React.SetStateAction<string[]>>;
  setIsWaiting: Dispatch<React.SetStateAction<boolean>>;
  setResponse: Dispatch<React.SetStateAction<ResponseGemini | undefined>>;
}