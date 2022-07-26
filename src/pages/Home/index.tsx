import { Play } from "phosphor-react";
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
   FormContainer,
   TaskInput,
   MinutesAmountInput,
   CountdownContainer,
   Separator,
   StartCountdownButton
} from "./styles";
import { useEffect, useState } from "react";

const newCycleFormValidationSchema = zod.object({
   task: zod.string().min(1, 'Informe a tarefa.'),
   minutesAmount: zod
      .number()
      .min(5, 'O ciclo deve ser de no mínimo 5 minutos.')
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

   useEffect(() => {
      let interval: number;
      if (activeCycle) {
         interval = setInterval(() => {
            setAmountSecondsPassed(differenceInSeconds(new Date(), activeCycle.startDate))
         }, 1000)
      }

      return () => {
         clearInterval(interval);
      }
   }, [activeCycle]);

   function handleCreateNewCicle(data: NewCycleFormData) {
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

   const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
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
         <form onSubmit={handleSubmit(handleCreateNewCicle)} action="">
            <FormContainer>
               <label htmlFor="task">Vou trabalhar em</label>
               <TaskInput
                  type="text"
                  id="task"
                  placeholder="Dê um nome para seu projeto"
                  list="task-suggestions"
                  {...register('task')}
               />

               {/* 
                  Elemento html próprio para uma lista de sugestões para um input.
                  Este elemento será exibido automaticamente, assim que o usuário der
                  foco no input. Recebe um id, que será utilizado como referência no
                  atributo 'list' do input.
               */}
               <datalist id="task-suggestions">
                  <option value="Projeto 1" />
                  <option value="Projeto 2" />
                  <option value="Projeto 3" />
               </datalist>

               <label htmlFor="minutesAmount">durante</label>
               <MinutesAmountInput
                  type="number"
                  id="minutesAmount"
                  placeholder="00"
                  // Atributo nativo do html, que por estarmos utilizando no React,
                  // passamos o número entre chaves e não áspas. O step permite o 
                  // usuário incrementar e decrementar o número do input[type=number]
                  // de acordo com o valor passado como valor de step. No ex. abaixo
                  // 5, 10, 15
                  step={5}
                  min={5} // valor mínimo
                  max={60} // valor máximo
                  {...register('minutesAmount', { valueAsNumber: true })}
               />

               <span>minutos.</span>
            </FormContainer>


            <CountdownContainer>
               <span>{minutes[0]}</span>
               <span>{minutes[1]}</span>
               <Separator>:</Separator>
               <span>{seconds[0]}</span>
               <span>{seconds[1]}</span>
            </CountdownContainer>

            <StartCountdownButton disabled={isSubmitButtonDisabled} type="submit">
               <Play size={24} />
               Começar
            </StartCountdownButton>

         </form>
      </HomeContainer>
   )
}
