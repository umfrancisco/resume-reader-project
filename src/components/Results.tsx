
type Props = {
  response: ResponseGemini;
}

function Results({ response }: Props) {

  if (response) {
    return (
      <div className="ai-content">
        <h4>{response.nome_usuario}, {response.profissao}</h4>
        <p><b>Empresa: </b>{response.nome_empresa}</p>
        <p><b>Vaga escolhida: </b>{response.titulo_vaga}</p>
        <p><b>Compatibilidade: </b>{response.compatibilidade_vaga}/100</p>
        <p><b>Sugestões:</b></p>
        <ul>
          {response.sugestoes.map((s, index) => (
            <p key={index}>{index + 1}. {s}</p>
          ))}
        </ul>
      </div>
    )
  }

  return null;
}

export default Results;