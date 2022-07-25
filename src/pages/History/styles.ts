import styled from "styled-components";

export const HistoryContainer = styled.div`
   flex: 1;
   padding: 3.5rem;
   display: flex;
   flex-direction: column;

   h1 {
      font-size: 1.5rem;
      color: ${props => props.theme["gray-100"]}
   }
`;

export const HistoryList = styled.div`
   flex: 1;
   overflow: auto;
   margin-top: 2rem;

   table {
      width: 100%;
      border-collapse: collapse;
      min-width: 600px;

      th {
         background-color: ${props => props.theme["gray-600"]};
         padding: 1rem;
         text-align: left;
         color: ${props => props.theme["gray-100"]};
         font-size: 0.875rem;
         line-height: 1.6; // 160% d0 font-size

         &:first-child {
            border-top-left-radius: 8px;
            padding-left: 1.5rem;
         }

         &:last-child {
            border-top-right-radius: 8px;
            padding-right: 1.5rem;
         }
      }

      td {
         background-color: ${props => props.theme["gray-700"]};
         border-top: 4px solid ${props => props.theme["gray-800"]};
         padding: 1rem;
         font-size: 0.875rem;
         line-height: 1.6;

         &:first-child {
            width: 50%;
            padding-left: 1.5rem;
         }

         &:last-child {
            padding-right: 1.5rem;
         }
      }
   }
`;

const STATUS_COLORS ={
   yellow: 'yellow-500',
   green: 'green-500',
   red: 'red-500',
} as const // Adiciono o 'as const' no final para o typescript entender que cada
// chave do objeto, possui exatamente o valor passado, evitando que o typescript
// defina a chave (yellow, green ou red) como uma string que pode ter seu valor
// alterado.
interface StatusProps {
   // Os valores para a propriedade statusColor são as chaves do objeto
   // STATUS_COLORS. Isso pode ser escrito como:
   // statusColor: 'yellow' | 'red' | 'green';
   // ou, da maneira abaixo.
   // A vantagem de utilizar o keyof typeof é que se algum dia o objeto
   // STATUS_COLORS, mudar, eu não preciso alterar a definição da interface
   // StatusProps
   // Obs.: Como o typescript não consegue ler um objeto javascript, mas 
   // consegue ler a tipagem de um objeto javascript, precisamos fazer a leitura
   // do objeto, utilizando o 'typeof' e pegamos a chave do objeto com o 'keyof'.
   statusColor: keyof typeof STATUS_COLORS;
}

export const Status = styled.span<StatusProps>`
   display: flex;
   align-items: center;
   gap: 0.5rem;

   &::before {
      content: '';
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background: ${props => props.theme[STATUS_COLORS[props.statusColor]]};
   }
`;
