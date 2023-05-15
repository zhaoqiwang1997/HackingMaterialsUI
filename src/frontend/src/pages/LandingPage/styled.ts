import styled from 'styled-components';

export const BottomSection = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 2rem 6rem 3rem 6rem;
`;

export const Container = styled.div`
  width: 100%;
`;

export const HBox = styled.div`
  display: flex;
  gap: 3em;
  justify-content: center;
  margin-bottom: 1rem;
`;

export const MainHeading = styled.h2`
  color: var(--ui);
  font-size: 2.5rem;
  max-width: 50%;
  text-align: center;
`;

export const SubHeading = styled.h3`
  font-size: 2.5rem;
  margin-bottom: 3.2rem;
`;

export const UpperSection = styled.div`
  display: flex;
  background-color: var(--accent);
  height: 50vh;
  width: 100%;
`;

export const VBox = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;
