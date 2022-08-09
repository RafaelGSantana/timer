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

import { useContext } from "react";
// import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { NewCycleForm } from "./components/NewCycleForm";
import { CyclesContext } from "../../contexts/CyclesContext";

// Esquema de validação dos campos do formulário
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
   const { createNewCycle, interruptCurrentCycle, activeCycle } = useContext(CyclesContext);

   // Foi declarada uma constante para o hook useFor para termos acesso a todos os métodos/ propriedades que ela possui
   // e assim, posso enviar através do contexto próprio da lib React Hook Form (FormProvider).
   const newCycleForm = useForm<NewCycleFormData>({
      resolver: zodResolver(newCycleFormValidationSchema),
      defaultValues: {
         task: '',
         minutesAmount: 0
      }
   });

   // Desestruturação dos métodos que utiizaremos neste componente
   const { handleSubmit, watch, reset } = newCycleForm;

   // Função que executa a função createNewCycle, criada no contexto e executa o médoto reset do React Hook Form.
   function handleCreateNewCycle(data: NewCycleFormData) {
      createNewCycle(data);
      reset();
   }

   // Monitora o input 'task' (Controlled component).
   const task = watch('task');
   // Constante que obterá o valor de task, definindo se o botão será habilitado ou não.
   const isSubmitButtonDisabled = !task;

   return (
      <HomeContainer>
         <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">


               <FormProvider {...newCycleForm}>
                  <NewCycleForm />
               </FormProvider>
               <Countdown />

            {activeCycle ? (
               <StopCountdownButton onClick={interruptCurrentCycle} type="button">
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
