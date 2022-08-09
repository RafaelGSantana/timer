import { differenceInSeconds } from "date-fns";
import { useContext, useEffect } from "react";
import { CyclesContext } from "../../../../contexts/CyclesContext";

import {
   CountdownContainer,
   Separator
} from "./styles";

export function Countdown() {
   const {
      activeCycle,
      activeCycleId,
      markCurrentCycleAsFinished,
      amountSecondsPassed,
      setSecondsPassed
   } = useContext(CyclesContext);

   // Se tiver um ciclo ativo, retorn os minutos do ciclo em segundos, se não tiver, retorna zero.
   const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

   // Função para realizar a contagem regressiva do ciclo
   useEffect(() => {
      let interval: number;
      // Se tiver um ciclo ativo, compara a diferença em segundos (secondsDifference), entre a data atual (new Date()) e
      // a data do início do ciclo ativo (new Date(activeCycle.startDate))
      if (activeCycle) {
         interval = setInterval(() => {
            const secondsDifference = differenceInSeconds(
               new Date(), 
               // Garante que o formato da informação seja do tipo Date, pois quando esse valor (activeCycle.startDate)
               // é salvo no local storage, é necessário que façamos a conversão para string (como consta no contexto
               // CyclesContext, na const stateJSON), e ao fazer essa conversão nós acabamos perdendo o tipo do valor
               // (Date). Como o tipo da informação é perdido no momento que a salvamos no local storage, ao trazer a
               // informação do local storage para a aplicação, o JSON.parse() não traz o valor com a tipagem correta,
               // neste caso, está trazendo como "string" e isso causa erro na renderização do componente. Envolvendo a
               // informação com o new Date(), eu garanto que quando eu buscar essa informação do local storage e der um
               // JSON.parse(), a informação venha para a aplicação no formato correto, garantindo o funcionamento da
               // mesma.
               // Isso acontece com dados que não sejam strings, numbers ou arrays.
               new Date(activeCycle.startDate)
            );
            // Se a diferença entre as datas (atual e de início do ciclo), for maior ou igual que zero, encerra o ciclo,
            // se não, envia o valor contido em secondsDifference, como parâmetro da função setSecondsPassed, que por 
            // sua vez alterará o estado amountSecondsPassed (definido no arquivo CyclesContext.tsx)
            if (secondsDifference >= totalSeconds) {
               markCurrentCycleAsFinished();
               setSecondsPassed(totalSeconds);
               clearInterval(interval);
            } else {
               setSecondsPassed(secondsDifference);
            }
         }, 1000)
      }

      // Função que será executada, sempre que o useEffect for executado novamente. Antes de iniciar um ciclo, a função
      // vai limpa a variável 'interval', para que outro ciclo possa se iniciar.
      return () => {
         clearInterval(interval);
      }
   }, [
         activeCycle,
         totalSeconds,
         activeCycleId,
         setSecondsPassed,
         markCurrentCycleAsFinished
      ]);
   
   // Se tiver um ciclo ativo, retorna, o tempo que falta para o ciclo acabar, em segundos, e, se não tiver um ciclo ativo, retorna zero
   const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

   // Calcula a partir do total de segundos restantes, a quantidade de minutos que faltam para o ciclo acabar.
   // Como a conta pode retorna um número com casas decimais, arredondamos o valor para baixo com o Math.floor().
   const minutesAmountLeft = Math.floor(currentSeconds / 60);
   // Calcula a partir do total de segundos restantes, a quantidade de segundos que restam da divisão currentSeconds / 60.
   // utilizando o operador de resto (%).
   const secondsAmountLeft = currentSeconds % 60;
   // Converte o total de minutos que restam para uma string e caso a string tenha apenas uma caracter(numero), adiciona um zero
   // na frente do caracter, forçando a string a possuir 2 caracteres, para que possamos sempre trabalhar com uas posições na string
   const minutes = String(minutesAmountLeft).padStart(2, '0');
   // Converte o total de segundos que restam para uma string e caso a string tenha apenas uma caracter(numero), adiciona um zero
   // na frente do caracter, forçando a string a possuir 2 caracteres, para que possamos sempre trabalhar com uas posições na string
   const seconds = String(secondsAmountLeft).padStart(2, '0');

   // Atualiza o título da aba do navegador de forma dinâmica, de acordo com o nome do projeto e com a cronômetragem regressiva.
   useEffect(() => {
      if(activeCycle) {
         document.title = `${activeCycle?.task} - ${minutes}:${seconds}`
      }
   }, [minutes, seconds, activeCycle]);

   return (
      <CountdownContainer>
         <span>{minutes[0]}</span>
         <span>{minutes[1]}</span>
         <Separator>:</Separator>
         <span>{seconds[0]}</span>
         <span>{seconds[1]}</span>
      </CountdownContainer>
   )
}