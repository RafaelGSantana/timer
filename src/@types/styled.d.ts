// EXEMPLO DE COMO FAZER TIPAGEM DE TEMAS, INTEGRANDO O TYPESCRIPT COM STYLED-COMPONENTS.
import 'styled-components';
import { defaultTheme } from '../styles/themes/default';

// Guarda a tipagem de defaultTheme numa variável (ThemeType), isso porque, por mais que o typescript já inferi a tipagem
// automaticamente.
type ThemeType = typeof defaultTheme;

// O declare module cria uma tipagem para o módulo especificado, no caso, styled-components.
// Como não queremos sobrescrever toda a tipagem do styled-components mas apenas sobrescrever uma tipagem específica,
// nós importamos o styled-components, e dentro do declare module, pegamos a tipagem que queremos sobrescrever, e
// estendemos com a nossa tipagem.
declare module 'styled-components' {
   export interface DefaultTheme extends ThemeType{}
}
