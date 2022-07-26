import { HandPalm, Play } from "phosphor-react";
import { useForm } from "react-hook-form";
// '@hookform/resolvers/zod, vai permitir a integração do React-Hook-Form com a
// biblioteca de validação 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
// Importa o zod desta forma, pois a lib zod não possui um export default, e para
// não precisarmos importar função por função entre chaves, utilizamos a sintaxe
// * as zod, assim importamos todas as funções de uma só vez.
import * as zod from 'zod';
import { differenceInSeconds } from "date-fns";

import {
   HomeContainer,
   StartCountdownButton,
   StopCountdownButton
} from "./styles";

import { useEffect, useState } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";

const newCycleFormValidationSchema = zod.object({
   task: zod.string().min(1, 'Informe a tarefa.'),
   minutesAmount: zod
      .number()
      .min(1, 'O ciclo deve ser de no mínimo 5 minutos.')
      .max(60, 'O ciclo deve ser de no máximo 60 minutos.')
});

// interface NewCycleFormData {
//    task: string;
//    minutesAmount: number;
// }
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

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
   const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

   const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
      resolver: zodResolver(newCycleFormValidationSchema),
      defaultValues: {
         task: '',
         minutesAmount: 0
      }
   });

   // Buscar o ciclo ativo, no estado cycles, com base na informação contida no estado activeCycleId
   const activeCycle = cycles.find(cycle => cycle.id === activeCycleId);

   const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
   
   useEffect(() => {
      let interval: number;
      
      if (activeCycle) {
         interval = setInterval(() => {
            const secondsDifference = differenceInSeconds(
               new Date(), activeCycle.startDate
            );

            if (secondsDifference >= totalSeconds) {
               setCycles(state =>
                  state.map((cycle) => {
                     if(cycle.id === activeCycleId) {
                        return {...cycle, finishedDate: new Date()}
                     } else {
                        return cycle
                     }
                  })
               );
               setAmountSecondsPassed(totalSeconds);
               clearInterval(interval);
            } else {
               setAmountSecondsPassed(secondsDifference);
            }
         }, 1000)
      }

      return () => {
         clearInterval(interval);
      }
   }, [activeCycle, totalSeconds]);

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

   return (
      <HomeContainer>
         <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
            <NewCycleForm />

            <Countdown />

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
