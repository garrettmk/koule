import styled from 'styled-components';
import { Title as TitleComponent, Button, LinearProgress } from "../../atoms";
import { space, palette, fonts } from "../../theme";

export const Frame = styled.div`
  position: relative;  
  background-color: ${palette.background};
  min-height: ${space.units(7)};
  box-sizing: border-box;
  border-bottom: 1px solid ${palette.divider};
  display: flex;
`;

export const Spacer = styled.div`
  flex: 1 1 100%;
`;

export const BackButton = styled(Button)`
  border: none;
  background-color: transparent;
  font: ${fonts.label};
`;

export const Title = styled(TitleComponent)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const Loader = styled(LinearProgress)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;