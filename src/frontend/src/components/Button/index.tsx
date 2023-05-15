import React from 'react';
import { PrimaryButton, SecondaryButton } from './styled';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  primary?: boolean;
  fullWidth?: boolean;
  label: string;
}

function Button({
  primary = false,
  fullWidth = false,
  label,
  ...props
}: ButtonProps) {
  const StyledButton = primary ? PrimaryButton : SecondaryButton;
  return (
    <StyledButton type="button" fullWidth={fullWidth} {...props}>
      {label}
    </StyledButton>
  );
}

export default Button;
