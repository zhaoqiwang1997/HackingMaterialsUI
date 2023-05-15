import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const StepHeader = styled.div`
  text-align: left;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const Select = styled.select`
  border: solid 1px var(--text-secondary);
  border-radius: 5px;
  padding: 0.25rem 0.5rem;
`;
