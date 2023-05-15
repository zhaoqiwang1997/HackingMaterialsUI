import React from 'react';
import BaseStepInterface from '../../utils/BaseStepInterface';
import Button from '../Button';
import Tooltip from '../Tooltip';
import { Container, StepHeader } from './styled';

interface ButtonStepTypeProps extends BaseStepInterface {
  loading?: boolean;
  primary?: boolean;
  fullWidth?: boolean;
  buttonLabel: string;
  onClick: () => void;
}

function ButtonStepType({
  stepNumber,
  title,
  tooltipContent,
  loading = false,
  buttonLabel,
  onClick,
}: ButtonStepTypeProps) {
  return (
    <Container>
      <StepHeader>
        <label htmlFor={stepNumber}>
          Step {stepNumber}: {title}
        </label>
        <Tooltip placement="right" content={tooltipContent} />
      </StepHeader>

      <Button
        disabled={loading}
        primary
        onClick={onClick}
        label={loading ? 'Loading' : buttonLabel}
      />
    </Container>
  );
}

export default ButtonStepType;
