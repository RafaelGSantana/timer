import { HandPalm, Play } from "phosphor-react";
import { useForm } from "react-hook-form";

import { differenceInSeconds } from "date-fns";

import {
   HomeContainer,
   StartCountdownButton,
   StopCountdownButton
} from "./styles";

import { useEffect, useState } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";





interface Cycle {
   id: string;
   task: string;
   minutesAmount: number;
   startDate: Date;
   interruptDate?: Date;
   finishedDate?: Date;
}

export function Home() {
   const [cycles, setCycles] = useState<Cycle[]>([]); // Temos a informação de todos os ciclos
   const [activeCycleId, setActiveCycleId] = useState<string | null>(null); // Temos a informação do ciclo que está ativo
   



   // Buscar o ciclo ativo, no estado cycles, com base na informação contida no estado activeCycleId
   const activeCycle = cycles.find(cycle => cycle.id === activeCycleId);

   
   


   function handleCreateNewCycle(data: NewCycleFormData) {
      const id = String(new Date().getTime());

      const newCycle: Cycle = {
         id,
         task: data.task,
         minutesAmount: data.minutesAmount,
         startDate: new Date()
      };

      // Sempre que uma alteração de estado depender do valor anterior,
      // vamos usar o formato de arrow function para alterar o valor, respeitando
      // as closures no React
      setCycles(state => [...state, newCycle]);
      setActiveCycleId(id);
      setAmountSecondsPassed(0);

      reset();
   }

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
   console.log(cycles)
   console.log(activeCycle)
   console.log(activeCycleId)

   
   const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

   const minutesAmountLeft = Math.floor(currentSeconds / 60);
   const secondsAmountLeft = currentSeconds % 60;

   const minutes = String(minutesAmountLeft).padStart(2, '0');
   const seconds = String(secondsAmountLeft).padStart(2, '0');

   useEffect(() => {
      if(activeCycle) {
         document.title = `${activeCycle?.task} - ${minutes}:${seconds}`
      }
   }, [minutes, seconds, activeCycle]);

   // Monitora o input 'task' (Controlled component)
   const task = watch('task');
   const isSubmitButtonDisabled = !task;

   /**
    * Prop Drilling - Quando a gente tem MUITAS propriedades APENAS para comunicação entre componentes
    * Context Api - Permite  compartilharmos informações entre vários componentes ao mesmo tempo
    */

   return (
      <HomeContainer>
         <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
            <NewCycleForm />

            <Countdown
               activeCycle={activeCycle}
               setCycles={setCycles}
               activeCycleId={activeCycleId}
            />

            {activeCycle ? (
                  <StopCountdownButton onClick={handleInterruptCycle} type="button">
                     <HandPalm size={24} />
                     Interromper
                  </StopCountdownButton>
               ) : (
                  <StartCountdownButton disabled={isSubmitButtonDisabled} type="submit">
                     <Play size={24} />
                     Começar
                  </StartCountdownButton>
            )}
            

         </form>
      </HomeContainer>
   )
}
