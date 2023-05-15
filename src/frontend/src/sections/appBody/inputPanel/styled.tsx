import styled from 'styled-components';

export const Container = styled.div`
  background-color: var(--background);
  width: 20%;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow);
  clip-path: inset(0px -10px 0px 0px); // make shadow on the right only
`;

export const ScrollContainer = styled.div`
  overflow-y: auto;
  height: calc(100% - 50px);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
`;

export const StickyButtons = styled.div`
  background-color: var(--background-neutral-elevated);
  height: 50px;
  position: sticky;
  bottom: 0;
  border-top: 3px solid var(--accent);
  padding: 0.5rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 0.5rem;
`;
