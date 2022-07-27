import { useContext } from "react";
import { CyclesContext } from "../../contexts/CyclesContext";
import { HistoryContainer, HistoryList, Status } from "./styles";

export function History() {
   const { cycles } = useContext(CyclesContext);

   return (
      <HistoryContainer>
         <h1>Meu histórico</h1>

         <pre>
            {JSON.stringify(cycles, null, 2)}
         </pre>

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
                     <td>
                        <Status statusColor="yellow">Em andamento</Status>
                     </td>
                  </tr>
                  <tr>
                     <td>Tarefa</td>
                     <td>20 minutos</td>
                     <td>Há 15 dias</td>
                     <td>
                        <Status statusColor="green">Concluído</Status>
                     </td>
                  </tr>
                  <tr>
                     <td>Tarefa</td>
                     <td>20 minutos</td>
                     <td>Há 15 dias</td>
                     <td>
                        <Status statusColor="red">Interrompido</Status>
                     </td>
                  </tr>
                  <tr>
                     <td>Tarefa</td>
                     <td>20 minutos</td>
                     <td>Há 15 dias</td>
                     <td>
                        <Status statusColor="green">Concluído</Status>
                     </td>
                  </tr>
                  <tr>
                     <td>Tarefa</td>
                     <td>20 minutos</td>
                     <td>Há 15 dias</td>
                     <td>
                        <Status statusColor="green">Concluído</Status>
                     </td>
                  </tr>
               </tbody>
            </table>
         </HistoryList>
      </HistoryContainer>
   )
}
