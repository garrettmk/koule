import styled from 'styled-components';
import { Pager as PagerComponent } from '../../containers';
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

export const Pager = styled(PagerComponent)`
  position: relative;
  flex: 1 1 100%;
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
`;

export const Page = styled(Pager.Page)`
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;