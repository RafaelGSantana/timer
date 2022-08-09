import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { CyclesContextProvider } from './contexts/CyclesContext'
import { Router } from './Router'

import { GlobalStyle } from './styles/global'
import { defaultTheme } from './styles/themes/default'

export function App() {
  return (
   // Posso alterar o tema da aplicação, criando outro arquivo de temas e alternar os temas de acordo com a informação
   // obtida por um estado (useState) através de algum evento, exemplo, um clique do usuário, em algum botão.
    <ThemeProvider theme={defaultTheme}>
      <BrowserRouter>
         <CyclesContextProvider>
            <Router />
         </CyclesContextProvider>
      </BrowserRouter>
      <GlobalStyle />
    </ThemeProvider>
  )
}
