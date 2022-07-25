import styled from "styled-components";

export const HomeContainer = styled.div`
   flex: 1;

   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;

   form {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3.5rem;
   }
`;

export const FormContainer = styled.div`
   width: 100%;
   display: flex;
   align-items: center;
   justify-content: center;
   gap: 0.5rem;
   color: ${props => props.theme["gray-100"]};
   font-size: 1.125rem;
   font-weight: 700;
   flex-wrap: wrap; // quebra a linha conforme tamanho da tela
`;

// Estilização base, utilizada nos inputs da Home
const BaseInput = styled.input`
   background: transparent;
   height: 2.5rem;
   border: 0;
   border-bottom: 2px solid ${props => props.theme["gray-500"]};
   font-weight: 700;
   font-size: inherit; // herda o valor do font-size do elemento pai. Inherit pode ser aplicado para outras propriedades css
   padding: 0 0.5rem;

   &:focus {
      box-shadow: none;
      border-bottom: 2px solid ${props => props.theme["green-500"]};
   }

   &::placeholder {
      color: ${props => props.theme["gray-500"]};
   }
`;

export const TaskInput = styled(BaseInput)`
   flex: 1; // Ocupa o tamanho total disponível para o elemento, podendo aumentar ou diminuir, de acordo com o tamanho da tela. Para funcionar, o elemento pai precisar ter o display flex.

   // Soluçao para remover a seta do input, que é gerada automaticamente pelo elemento datalist, no input
   // Testado no Chrome e no Edge.
   &::-webkit-calendar-picker-indicator {
      display: none !important;
   }
`;

export const MinutesAmountInput = styled(BaseInput)`
   width: 4rem;
`;

export const CountdownContainer = styled.div`
   font-family: 'Roboto Mono', monospace; // font mono espaçada deixa todos os caracteres com o mesmo espaçamento na largura.
   font-size: 10rem;
   line-height: 8rem;
   color: ${props => props.theme["gray-100"]};

   display: flex;
   gap: 1rem;

   span {
      background: ${props => props.theme["gray-700"]};
      padding: 2rem 1rem;
      border-radius: 8px;
   }
`;

export const Separator = styled.div`
   padding: 2rem 0;
   color: ${props => props.theme["green-500"]};
   width: 4rem;
   overflow: hidden;
   display: flex;
   justify-content: center;
`;

export const StartCountdownButton = styled.button`
   width: 100%;
   border: none;
   padding: 1rem;
   border-radius: 8px;

   display: flex;
   align-items: center;
   justify-content: center;
   gap: 0.5rem;
   font-weight: 700;

   cursor: pointer;

   background: ${props => props.theme["green-500"]};
   color: ${props => props.theme["gray-100"]};

   &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
   }

   &:not(:disabled):hover {
      background: ${props => props.theme["green-700"]};
   }
`;
