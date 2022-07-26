import { Play } from "phosphor-react";
import { useForm } from "react-hook-form";
// '@hookform/resolvers/zod, vai permitir a integração do React-Hook-Form com a
// biblioteca de validação 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
// Importa o zod desta forma, pois a lib zod não possui um export default, e para
// não precisarmos importar função por função entre chaves, utilizamos a sintaxe
// * as zod, assim importamos todas as funções de uma só vez.
import * as zod from 'zod';

import { 
   HomeContainer,
   FormContainer,
   TaskInput,
   MinutesAmountInput,
   CountdownContainer,
   Separator,
   StartCountdownButton
} from "./styles";

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

export function Home() {
   const { register, handleSubmit, watch } = useForm<NewCycleFormData>({
      resolver: zodResolver(newCycleFormValidationSchema),
      defaultValues: {
         task: '',
         minutesAmount: 0
      }
   });

   function handleCreateNewCicle(data: NewCycleFormData) {
      console.log(data)
   }

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
               <span>0</span>
               <span>0</span>
               <Separator>:</Separator>
               <span>0</span>
               <span>0</span>
            </CountdownContainer>

            <StartCountdownButton disabled={isSubmitButtonDisabled} type="submit">
               <Play size={24} />
               Começar
            </StartCountdownButton>

         </form>
      </HomeContainer>
   )
}
