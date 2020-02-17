import styled from 'styled-components';

export const Text = styled.span`
  font: ${ props => props.theme.fonts.body };
  color: ${ props => props.theme.colors.text.primary };
`;

Text.Title = styled.p`
  font: ${ props => props.theme.fonts.title };
  color: ${ props => props.theme.colors.text[props.color || 'primary'] };
  margin: 0;
`;

Text.Subtitle = styled.p`
  font: ${ props => props.theme.fonts.subtitle };
  color: ${ props => props.theme.colors.text[props.color || 'primary'] };
  margin: 0;
`;

Text.Body = styled.span`
  font: ${ props => props.theme.fonts.body };
  color: ${ props => props.theme.colors.text[props.color || 'primary'] };  
`;

Text.Caption = styled.span`
  font: ${ props => props.theme.fonts.caption };
  color: ${ props => props.theme.colors.text[props.color || 'primary'] };
`;
