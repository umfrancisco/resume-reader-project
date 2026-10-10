declare type AiResponse = {
  nome_usuario: string;
  profissao: string;
  sugestoes: string[];
  nome_empresa: string;
  titulo_vaga: string;
  compatibilidade_vaga: number;
}

declare type HandleRequestProps = {
  e: MouseEvent<HTMLButtonElement, MouseEvent>;
  pages: string[];
  jobDescription: string;
  setPages: Dispatch<React.SetStateAction<string[]>>;
  setIsWaiting: Dispatch<React.SetStateAction<boolean>>;
  setResponse: Dispatch<React.SetStateAction<AiResponse | undefined>>;
}