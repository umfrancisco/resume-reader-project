
type Props = {
  saved: AiResponse[];
}

function History({ saved }: Props) {
  return (
    <div className="history-bar">
      <h4>History</h4>
      {saved.map(s => (
        <p key={s.titulo_vaga + s.nome_empresa}>- {s.titulo_vaga} em {s.nome_empresa}</p>
      ))}
    </div>
  );
}

export default History;