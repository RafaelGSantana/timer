import { HandPalm, Play } from "phosphor-react";
import { useForm } from "react-hook-form";

import { differenceInSeconds } from "date-fns";

import {
   HomeContainer,
   StartCountdownButton,
   StopCountdownButton
} from "./styles";

import { createContext, useEffect, useState } from "react";
// import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
interface Cycle {
   id: string;
   task: string;
   minutesAmount: number;
   startDate: Date;
   interruptDate?: Date;
   finishedDate?: Date;
}

interface CyclesContextType {
   activeCycle: Cycle | undefined;
   activeCycleId: string | null;
   markCurrentCycleAsFinished: () => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

export function Home() {
   const [cycles, setCycles] = useState<Cycle[]>([]); // Temos a informação de todos os ciclos
   const [activeCycleId, setActiveCycleId] = useState<string | null>(null); // Temos a informação do ciclo que está ativo
   // Buscar o ciclo ativo, no estado cycles, com base na informação contida no estado activeCycleId
   const activeCycle = cycles.find(cycle => cycle.id === activeCycleId);

   // function handleCreateNewCycle(data: NewCycleFormData) {
   //    const id = String(new Date().getTime());

   //    const newCycle: Cycle = {
   //       id,
   //       task: data.task,
   //       minutesAmount: data.minutesAmount,
   //       startDate: new Date()
   //    };

      // Sempre que uma alteração de estado depender do valor anterior,
      // vamos usar o formato de arrow function para alterar o valor, respeitando
      // as closures no React
   //    setCycles(state => [...state, newCycle]);
   //    setActiveCycleId(id);
   //    setAmountSecondsPassed(0);

   //    reset();
   // }

   function handleInterruptCycle() {
      setCycles(
         state => state.map((cycle) => {
            if(cycle.id === activeCycleId) {
               return {...cycle, interruptDate: new Date()};
            } else {
               return cycle;
            }
         })
      );

      setActiveCycleId(null);
      
   }
   
   function markCurrentCycleAsFinished() {
      setCycles(state =>
         state.map((cycle) => {
            if(cycle.id === activeCycleId) {
               return {...cycle, finishedDate: new Date()}
            } else {
               return cycle
            }
         })
      );
   }

   // Monitora o input 'task' (Controlled component)
   // const task = watch('task');
   // const isSubmitButtonDisabled = !task;

   /**
    * Prop Drilling - Quando a gente tem MUITAS propriedades APENAS para comunicação entre componentes
    * Context Api - Permite  compartilharmos informações entre vários componentes ao mesmo tempo
    */

   return (
      <HomeContainer>
         <form /*onSubmit={handleSubmit(handleCreateNewCycle)}*/ action="">

            <CyclesContext.Provider value={{ activeCycle, activeCycleId, markCurrentCycleAsFinished }}>
               {/* <NewCycleForm /> */}
               <Countdown />
            </CyclesContext.Provider>

            {activeCycle ? (
                  <StopCountdownButton onClick={handleInterruptCycle} type="button">
                     <HandPalm size={24} />
                     Interromper
                  </StopCountdownButton>
               ) : (
                  <StartCountdownButton/* disabled={isSubmitButtonDisabled}*/ type="submit">
                     <Play size={24} />
                     Começar
                  </StartCountdownButton>
            )}
            

         </form>
      </HomeContainer>
   )
}
