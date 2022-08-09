import { differenceInSeconds } from "date-fns";
import { createContext, ReactNode, useEffect, useReducer, useState } from "react";
import { addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer";

interface CreateCycleData {
   task: string;
   minutesAmount: number; 
}

interface CyclesContextType {
   cycles: Cycle[];
   activeCycle: Cycle | undefined;
   activeCycleId: string | null;
   amountSecondsPassed: number;
   markCurrentCycleAsFinished: () => void;
   setSecondsPassed: (seconds: number) => void;
   createNewCycle: (data: CreateCycleData) => void;
   interruptCurrentCycle: () => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

interface CyclesContextProviderProps {
   children: ReactNode;
}

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
   // Primeiro parâmetro(1º): São as ações que serão disparadas de acordo com cada action. Essas ações foram definidas
   // na função cyclesReducer.
   // Segundo parâmetro(2º): é o valor inicial do estado(cyclesState)
   // Terceiro parâmetro(3º): Função que é disparada assim que o reducer for criado, e ela recupera os dados do
   // reducer(cyclesState) de outro lugar(nos caso, local storage)
   const [cyclesState, dispatch] = useReducer(cyclesReducer, {
         cycles: [],
         activeCycleId: null
      }, () => {
         // busca informação no local storage e armezena numa variável
         const storedStateAsJSON = localStorage.getItem('@ignite-timer:cycles-state-v1.0.0');

         // se encontrar essa informação, converte a informação para o formato original(pois a informação foi convertida
         // para string, antes de ser salva)
         if (storedStateAsJSON) {
            return JSON.parse(storedStateAsJSON);
         }
      }
   );

   // Desestruturação do cyclesState, para utilização das informações de forma independente
   const { cycles, activeCycleId } = cyclesState;
   // Buscar o ciclo ativo, no estado cycles, com base na informação contida no estado activeCycleId
   const activeCycle = cycles.find(cycle => cycle.id === activeCycleId);

   const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
      // Se tiver um ciclo ativo, retorna a diferença em segundos entre o início do ciclo e a hora atual.
      if (activeCycle) {
         return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
      }
      // Se não tiver um ciclo ativo, retorna zero.
      return 0;
   });

   // Sempre que o cyclesState receber uma alteração, salva a informaçao atualizada no local storage do browser.
   useEffect(() => {
      // Como o local storage não suporta formatos mais complexos de dados, é necessário fazer a conversão do valor do
      // estado para string.
      const stateJSON = JSON.stringify(cyclesState);

      // Salva o nome(nome-da-aplicacao:nome-da-informacao-versão) + valor no localstorage. 
      // Salvando e atualizando o nome da informação, contendo versão, garantimos que todos da equipe trabalhem na
      // versao atualizada, visto que a aplicação não trará os dados da versão antiga.
      // Esta última dica, sobre a versão se aplica para aplicações que estejam em produção.
      localStorage.setItem('@ignite-timer:cycles-state-v1.0.0', stateJSON)
   }, [cyclesState]);


   // Função criada para ser passada através do contexto, para que o componente <Countdown /> consiga alterar o estado
   // amountSecondsPassed. Foi feito deste forma para facilitar na tipagem, seria possível passar diretamente o
   // setAmountSecondsPassed através do contexto.
   function setSecondsPassed(seconds: number) {
      setAmountSecondsPassed(seconds);
   }

   // Função de criação do novo ciclo
   function createNewCycle(data: CreateCycleData) {
      const id = String(new Date().getTime()); // "1659442882058"

      // Formato do novo ciclo iniciado
      const newCycle: Cycle = {
         id,
         task: data.task,
         minutesAmount: data.minutesAmount,
         startDate: new Date()
      };
      
      // Dispara a action que contém o action.type 'ADD_NEW_CYCLE' e o payload com os dados do novo ciclo.
      dispatch(addNewCycleAction(newCycle));
      // Quando um novo ciclo é criado, reseta o estado de quantos segundos já se passaram, para zero.
      setAmountSecondsPassed(0);
   }

   function interruptCurrentCycle() {
      // Dispara a action que contém o action.type 'INTERRUPT_CURRENT_CYCLE'
      dispatch(interruptCurrentCycleAction());
   }

   function markCurrentCycleAsFinished() {
      // Dispara a action que contém o action.type 'MARK_CURRENT_CYCLE_AS_FINISHED'
      dispatch(markCurrentCycleAsFinishedAction());
   }

   return (
      <CyclesContext.Provider value={{
         cycles,
         activeCycle,
         activeCycleId,
         markCurrentCycleAsFinished,
         amountSecondsPassed,
         setSecondsPassed,
         createNewCycle,
         interruptCurrentCycle
      }}>
         {children}
      </CyclesContext.Provider>
   )
}