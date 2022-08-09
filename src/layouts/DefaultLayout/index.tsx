import { Outlet } from 'react-router-dom'
import { Header } from '../../components/Header'
import { LayoutContainer } from './styles'

export function DefaultLayout() {
   return (
      <LayoutContainer>
         <Header />
         {/** O Outlet é uma área reservada para o conteúdo/ componente que será renderizado */}
         <Outlet />
      </LayoutContainer>
   )
}