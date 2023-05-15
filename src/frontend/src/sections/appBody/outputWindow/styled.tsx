import styled from 'styled-components';

export const Container = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  background-color: var(--background-sunken);
`;

export const OutputsContianer = styled.div`
  padding: 3rem;
  overflow-y: auto;
  max-height: calc(100% - 40px);
`;

export const GlobalOutputsContainer = styled.div`
  padding: 1rem;
  border-bottom: solid 1px grey;
`;

export const StepOutputsContainer = styled.div`
  padding: 0rem 1rem 1rem 1rem;
  border-bottom: solid 1px grey;
`;
