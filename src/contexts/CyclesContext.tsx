import { createContext, ReactNode, useState } from "react";

interface CreateCycleData {
   task: string;
   minutesAmount: number; 
}

interface Cycle {
   id: string;
   task: string;
   minutesAmount: number;
   startDate: Date;
   interruptDate?: Date;
   finishedDate?: Date;
}

interface CyclesContextType {
   cycles: Cycle[];
   activeCycle: Cycle | undefined;
   activeCycleId: string | null;
   amountSecondsPassed: number;
   markCurrentCycleAsFinished: () => void;
   setSecondsPassed: (seconds: number) => void;
   createNewCycle: (data: CreateCycleData) => void;
   interruptCurrentCycle: () => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

interface CyclesContextProviderProps {
   children: ReactNode;
}

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
   const [cycles, setCycles] = useState<Cycle[]>([]); // Temos a informação de todos os ciclos
   const [activeCycleId, setActiveCycleId] = useState<string | null>(null); // Temos a informação do ciclo que está ativo
   const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);
   const activeCycle = cycles.find(cycle => cycle.id === activeCycleId); // Buscar o ciclo ativo, no estado cycles, com base na informação contida no estado activeCycleId

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

   function createNewCycle(data: CreateCycleData) {
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

      // reset();
   }

   function interruptCurrentCycle() {
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

   return (
      <CyclesContext.Provider value={{
         cycles,
         activeCycle,
         activeCycleId,
         markCurrentCycleAsFinished,
         amountSecondsPassed,
         setSecondsPassed,
         createNewCycle,
         interruptCurrentCycle
      }}>
         {children}
      </CyclesContext.Provider>
   )
}