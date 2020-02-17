import styled from 'styled-components';

export const Button = styled.button`
  background-color: ${ props => props.variant === 'outline' 
    ? 'transparent' 
    : props.theme.colors[props.color] 
  };
  
  border: 2px solid ${ props => props.theme.colors[props.color] };
  border-radius: ${ props => props.theme.borderRadius };
  font: ${ props => props.theme.fonts.body };
  color: ${props => props.variant === 'outline'
    ? props.theme.colors[props.color]
    : props.theme.colors.text.primary
  };
  
  padding: ${ props => props.theme.sizing.units(1) };
`;