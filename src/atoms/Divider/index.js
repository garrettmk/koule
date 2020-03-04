import styled from 'styled-components';
import { palette } from "../../theme";

export const Divider = styled.div`
  height: ${ ({ vertical }) => vertical ? '100%' : '1px' };
  width: ${ ({ vertical }) => vertical ? '1px' : '100%' };
  background-color: ${palette.divider};
`;