
type Props = {
  response: ResponseGemini;
}

function Results({ response }: Props) {

  if (response) {
    return (
      <div>
        <h4>{response.nome_usuario}, {response.profissao}</h4>
        <p>Compatibility: {response.compatibilidade_vaga}/100</p>
        <p>Suggestions:</p>
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