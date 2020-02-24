import styled from 'styled-components';
import { Screen as ScreenComponent } from "../../components";

export const Screen = styled(ScreenComponent)`
  display: flex;
  flex-direction: column;
`;

export const ContentArea = styled.div`
  position: relative;
  flex: 1 1 100%;
  overflow-y: scroll;
  overflow-x: hidden;
`;