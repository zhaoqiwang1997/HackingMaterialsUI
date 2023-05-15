import styled from 'styled-components';

const Output = styled.div`
  border-radius: 0.5rem;
  border: solid 2px;
  width: 100%;
  padding: 0.75rem;
  margin: 1rem 0rem;
`;

export const ErrorOutput = styled(Output)`
  border-color: red;
  background-color: rgba(255, 0, 0, 0.2);
`;

export const StandardOutput = styled(Output)`
  border-color: black;
  background-color: rgba(255, 255, 255, 0.2);
`;

export const SuccessOutput = styled(Output)`
  border-color: green;
  background-color: rgba(0, 255, 0, 0.2);
`;

export const WarningOutput = styled(Output)`
  border-color: rgb(255, 204, 0);
  background-color: rgba(255, 204, 0, 0.2);
`;
