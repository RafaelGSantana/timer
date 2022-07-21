import styled from "styled-components";

export const HeaderContainer = styled.header`
   display: flex;
   align-items: center;
   justify-content: space-between;

   nav {
      display: flex;
      gap: 0.5rem;

      a {
         width: 3rem;
         height: 3rem;

         display: flex;
         justify-content: center;
         align-items: center;

         color: ${props => props.theme["gray-100"]};

         /* Essas bordas estão definidas como transparente, pois no hover, iremos adicicionar uma cor no border-bottom.
         Se não definíssemos estas bordas como transparente, ao adicionar uma borda no elemento, o elemento iria
         se mover, efeito que não queremos. O border-top, transparente, vai manter o elemento centralizado. */
         border-top: 3px solid transparent;
         border-bottom: 3px solid transparent;

         &:hover {
            border-bottom: 3px solid ${props => props.theme["green-500"]};
         }

         /* A classe active é definida automaticamente pelo NavLink do reactRouterDom */
         &.active {
            color: ${props => props.theme["green-500"]};;
         }
      }
   }
`;