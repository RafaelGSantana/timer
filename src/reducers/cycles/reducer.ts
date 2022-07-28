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

interface CyclesState {
   cycles: Cycle[];
   activeCycleId: string | null;
}

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