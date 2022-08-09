/*
Neste arquivo contém a função cyclesReducer, que contém a lógica das ações que são executadas, de acordo com a
action.type disparada. Para isso, importamos as ActionTypes, do arquivo de actions, e para realizar a lógica de cada
action disparada, optamos por utilizar a biblioteca Immer, que é utilizada para trabalharmos com estrutura de dados
imutáveis (imutabilidade), como se essa estrutura não fosse imutável. Ex.: Ao invés de percorrer um array num estado,
copiar todo o valor dele e alterar uma propriedade específica, ou simplesmente criar um novo valor para o estado,
o immer nos permite fazer alterações em variáveis (imutáveis) do React, como estados, reducer, etc.., como se fossem 
variáveis tradicionais do próprio javascript.
Então, com o immer eu posso alterar um array num estado, criando um rascunho do estado e fazendo a alteração, utilizando
um método tradicional do javascript, por exemplo, push, e "por baixo dos panos", o immer faz a conversão desse código
para alteracões imutáveis, como um setState.
Veja a diferença:

Alteração imutável (copia o valor atual do estado e faz as alterações nas propriedades ou variáveis desejadas):

   case ActionTypes.ADD_NEW_CYCLE:
      return {
         ...state,
         cycles: [...state.cycles, action.payload.newCycle],
         activeCycleId: action.payload.newCycle.id
      }

Alteração com o immer (Faz um rascunho do valor atual do estado, e altera com método tradicional do javascript
ou substitui o valor por completo, das variáveis ou propriedades desejadas):

   case ActionTypes.ADD_NEW_CYCLE:
      return produce(state, draft => {
         draft.cycles.push(action.payload.newCycle);
         draft.activeCycleId = action.payload.newCycle.id;
      })
*/

import { produce } from 'immer';

import { ActionTypes } from "./actions";

export interface Cycle {
   id: string;
   task: string;
   minutesAmount: number;
   startDate: Date;
   interruptDate?: Date;
   finishedDate?: Date;
}

// Tipagem das informações que serão salvas no reducer
interface CyclesState {
   cycles: Cycle[];
   activeCycleId: string | null;
}

// Função que contém a lógica das ações que são executadas, de acordo com a action.type disparada
// O método produce do immer recebe:
// 1º parâmetro a informação que queremos modificar
// 2º parâmetro: uma função que recebe, como parâmetro, o rascunho (draft) do primeiro parâmetro, ou seja, contém a
// mesma informação, e no draft, rascunho, realiza as alterações das informações desejadas, como se fossem informações
// mutáveis.
export function cyclesReducer(state: CyclesState, action: any) {
   switch(action.type) {
      case ActionTypes.ADD_NEW_CYCLE:
         return produce(state, draft => {
            draft.cycles.push(action.payload.newCycle);
            draft.activeCycleId = action.payload.newCycle.id;
         })
      case ActionTypes.INTERRUPT_CURRENT_CYCLE:
         const currentCycleIndexForInterruptCycleAction = state.cycles.findIndex(cycle => {
            return cycle.id === state.activeCycleId;
         });

         // Se o findIndex não encontrar o index correspondente à verificação de igualdade de id acima, retornará -1
         if(currentCycleIndexForInterruptCycleAction < 0) {
            return state;
         }

         return produce(state, draft => {
            draft.activeCycleId = null;
            draft.cycles[currentCycleIndexForInterruptCycleAction].interruptDate = new Date();
         })
      case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED:
         const currentCycleIndexForFinishedCycleAction = state.cycles.findIndex(cycle => {
            return cycle.id === state.activeCycleId;
         });

         // Se o findIndex não encontrar o index correspondente à verificação de igualdade de id acima, retornará -1
         if(currentCycleIndexForFinishedCycleAction < 0) {
            return state;
         }

         return produce(state, draft => {
            draft.cycles[currentCycleIndexForFinishedCycleAction].finishedDate = new Date();
            draft.activeCycleId = null;
         })
      default:
         return state;
   }
}