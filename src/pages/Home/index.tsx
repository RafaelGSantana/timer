import { HandPalm, Play } from "phosphor-react";
import { FormProvider, useForm } from "react-hook-form";
// '@hookform/resolvers/zod, vai permitir a integração do React-Hook-Form com a
// biblioteca de validação 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
// Importa o zod desta forma, pois a lib zod não possui um export default, e para
// não precisarmos importar função por função entre chaves, utilizamos a sintaxe
// * as zod, assim importamos todas as funções de uma só vez.
import * as zod from 'zod';

import {
   HomeContainer,
   StartCountdownButton,
   StopCountdownButton
} from "./styles";

import { createContext, useEffect, useState } from "react";
// import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { NewCycleForm } from "./components/NewCycleForm";
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
   amountSecondsPassed: number;
   markCurrentCycleAsFinished: () => void;
   setSecondsPassed: (seconds: number) => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

const newCycleFormValidationSchema = zod.object({
   task: zod.string().min(1, 'Informe a tarefa.'),
   minutesAmount: zod
      .number()
      .min(5, 'O ciclo deve ser de no mínimo 5 minutos.')
      .max(60, 'O ciclo deve ser de no máximo 60 minutos.')
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>
// type NewCycleFormData teve a tipagem inferida de acordo com a validação do zod, descrita acima. 
// Seria o mesmo que fazer:
//    interface NewCycleFormData {
//       task: string;
//       minutesAmount: number;
//    }

export function Home() {
   const [cycles, setCycles] = useState<Cycle[]>([]); // Temos a informação de todos os ciclos
   const [activeCycleId, setActiveCycleId] = useState<string | null>(null); // Temos a informação do ciclo que está ativo
   const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);
   const activeCycle = cycles.find(cycle => cycle.id === activeCycleId); // Buscar o ciclo ativo, no estado cycles, com base na informação contida no estado activeCycleId

   const newCycleForm = useForm<NewCycleFormData>({
      resolver: zodResolver(newCycleFormValidationSchema),
      defaultValues: {
         task: '',
         minutesAmount: 0
      }
   });

   const { handleSubmit, watch, reset } = newCycleForm;

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
            if (cycle.id === activeCycleId) {
               return { ...cycle, interruptDate: new Date() };
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
            if (cycle.id === activeCycleId) {
               return { ...cycle, finishedDate: new Date() }
            } else {
               return cycle
            }
         })
      );
   }

   function setSecondsPassed(seconds: number) {
      setAmountSecondsPassed(seconds);
   }

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

            <CyclesContext.Provider value={{
               activeCycle,
               activeCycleId,
               markCurrentCycleAsFinished,
               amountSecondsPassed,
               setSecondsPassed
            }}>
               <FormProvider {...newCycleForm}>
                  <NewCycleForm />
               </FormProvider>
               <Countdown />
            </CyclesContext.Provider>

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
