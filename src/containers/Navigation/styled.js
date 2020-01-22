import styled from "styled-components";

export const Navigation = styled.div`
  position: relative;
  height: 72px;
  display: flex;
  justify-content: center;
  mask: linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
`;

export const Icons = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  left: ${ props => -56 * props.offset }px;
  transition: left 250ms ease-in-out;
`;
