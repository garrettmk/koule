import styled from 'styled-components';
import { NavigateBackIcon } from "../../icons";

export const BackIcon = styled(NavigateBackIcon)`
  color: ${ props => props.theme.colors.text.secondary };
`;