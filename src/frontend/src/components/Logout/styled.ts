import styled from 'styled-components';

export const LinkButton = styled.button`
  background-color: white;
  border: 0;
  text-decoration: none;
  color: var(--text-primary);
  height: 25px;
  font-size: 0.45rem;
  font-weight: bold;
  transition: color 0.3s ease;
  width: 100%;

  &:hover {
    background-color: #f0f0f0;
    cursor: pointer;
  }
`;
