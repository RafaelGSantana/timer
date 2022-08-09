// Neste arquivo, contém uma função para cada action. Estas funções serão chamadas como parâmetro do 
// método dispatch do useReducer, no CyclesContext.
// Este arquivo foi criado com o intuito de abstrair o objeto de dentro de cada método dispatch e separá-los
// num único arquivo. Dessa forma, sempre que eu precisar executar o dispatch, ao invés de eu passar o objeto
// contendo as informações necessárias, eu passo apenas a função da ActionType que quero disparar, e passar informações
// de forma errada.

/*
Exemplo:
Ao invés de, em cada action de "Criar novo ciclo" que eu for disparar, eu passar o objeto:

   function disparaActionCriarNovoCiclo(parâmetroSePrecisar) {
      dispatch({
         type: ActionTypes.ADD_NEW_CYCLE,
         payload: {
            newCycle
         }
      })
   }

Eu simplesmente passo a função definida aqui, como parâmetro do dispatch

function criarNovoCiclo() {
   dispatch(disparaActionCriarNovoCiclo(parâmetroSePrecisar))
}
*/

import { Cycle } from "./reducer";

// Define um enum para as actions, para obtermos a recomendação das actions que posso utilizar
// quando digitarmos ActionTypes.
export enum ActionTypes {
   ADD_NEW_CYCLE = 'ADD_NEW_CYCLE',
   INTERRUPT_CURRENT_CYCLE = 'INTERRUPT_CURRENT_CYCLE',
   MARK_CURRENT_CYCLE_AS_FINISHED = 'MARK_CURRENT_CYCLE_AS_FINISHED',
}


export function addNewCycleAction(newCycle: Cycle) {
   return {
      type: ActionTypes.ADD_NEW_CYCLE,
      payload: {
         newCycle
      }
   }
}

export function interruptCurrentCycleAction() {
   return {
      type: ActionTypes.INTERRUPT_CURRENT_CYCLE,
   }
}

export function markCurrentCycleAsFinishedAction() {
   return {
      type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
   }
}