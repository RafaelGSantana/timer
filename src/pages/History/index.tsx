import { HistoryContainer, HistoryList } from "./styles";

export function History() {
  return (
   <HistoryContainer>
      <h1>Meu histórico</h1>

      <HistoryList>
         {/* O componente HistoryList só foi criado para podermos aplicar um scroll
         horizontal na tabela, para efeito de resposividade. */}
         <table>
            <thead>
               <tr>
                  <th>Tarefa</th>
                  <th>Duração</th>
                  <th>Início</th>
                  <th>Status</th>
               </tr>
            </thead>

            <tbody>
               <tr>
                  <td>Tarefa</td>
                  <td>20 minutos</td>
                  <td>Há 15 dias</td>
                  <td>Concluído</td>
               </tr>
               <tr>
                  <td>Tarefa</td>
                  <td>20 minutos</td>
                  <td>Há 15 dias</td>
                  <td>Concluído</td>
               </tr>
               <tr>
                  <td>Tarefa</td>
                  <td>20 minutos</td>
                  <td>Há 15 dias</td>
                  <td>Concluído</td>
               </tr>
               <tr>
                  <td>Tarefa</td>
                  <td>20 minutos</td>
                  <td>Há 15 dias</td>
                  <td>Concluído</td>
               </tr>
               <tr>
                  <td>Tarefa</td>
                  <td>20 minutos</td>
                  <td>Há 15 dias</td>
                  <td>Concluído</td>
               </tr>
            </tbody>
         </table>
      </HistoryList>
   </HistoryContainer>
  )
}
