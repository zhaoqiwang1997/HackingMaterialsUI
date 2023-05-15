import styled from 'styled-components';

type StyledButtonProps = {
  fullWidth: boolean;
};

const BasicButton = styled.button<StyledButtonProps>`
  text-align: center;
  border: solid 2px var(--accent);
  border-radius: 5px;
  padding: 0.25rem 0.5rem;
  font-weight: 600;
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};

  &:disabled {
    opacity: 0.4;
  }

  &:hover {
    filter: brightness(90%);
  }

  &:active {
    filter: brightness(85%);
  }
`;

export const PrimaryButton = styled(BasicButton)<StyledButtonProps>`
  background-color: var(--accent);
  color: white;
`;

export const SecondaryButton = styled(BasicButton)<StyledButtonProps>`
  background-color: var(--ui);
  color: var(--accent);
`;
