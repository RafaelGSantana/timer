import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header'
import { Home } from '../pages/Home'

export function DefaultLayout() {
   return (
      <div>
         <Header />
         {/** O Outlet é uma área reservada para o conteúdo/ componente que será renderizado */}
         <Outlet />
      </div>
   )
}