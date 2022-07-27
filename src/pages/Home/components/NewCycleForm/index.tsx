import { useContext } from "react";

import {
   FormContainer,
   TaskInput,
   MinutesAmountInput,
} from "./styles";

import { CyclesContext } from "../..";
import { useFormContext } from "react-hook-form";

export function NewCycleForm() {
   const { activeCycle } = useContext(CyclesContext);
   const { register } = useFormContext();

   return(
      <FormContainer>
         <label htmlFor="task">Vou trabalhar em</label>
         <TaskInput
            type="text"
            id="task"
            placeholder="Dê um nome para seu projeto"
            list="task-suggestions"
            {...register('task')}
            disabled={!!activeCycle} // Converte o activeCycle para boolean colocando os !!
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
            disabled={!!activeCycle}
         />

         <span>minutos.</span>
      </FormContainer >
   )
}