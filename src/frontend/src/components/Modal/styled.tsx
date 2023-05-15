import styled from 'styled-components';

export const Container = styled.div`
  background-color: #fefefe;
  border-radius: 2px;
  margin: auto;
  padding: 20px;
  width: 60%;
  height: 60%;
`;

export const Content = styled.div`
  display: flex;
  justify-content: center;
  overflow-y: auto;
  height: calc(90% - 1rem);
`;

export const Overlay = styled.div`
  position: fixed;
  z-index: 100;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
`;

export const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;

export const CloseBtn = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1;
  color: #000;
  opacity: 0.3;
  cursor: pointer;
  border: none;
`;
