import React from 'react';
import {
  ErrorOutput,
  StandardOutput,
  SuccessOutput,
  WarningOutput,
} from './styled';

export type TextWorkflowOutputType =
  | 'success'
  | 'error'
  | 'warning'
  | 'standard';

type TextWorkflowOutputProps = {
  type?: TextWorkflowOutputType;
  children: React.ReactNode;
};

function TextWorkflowOutput({
  type = 'standard',
  children,
}: TextWorkflowOutputProps) {
  let StyledOutput;
  switch (type) {
    case 'success': {
      StyledOutput = SuccessOutput;
      break;
    }
    case 'error': {
      StyledOutput = ErrorOutput;
      break;
    }
    case 'warning': {
      StyledOutput = WarningOutput;
      break;
    }
    default: {
      StyledOutput = StandardOutput;
      break;
    }
  }

  return <StyledOutput>{children}</StyledOutput>;
}

export default TextWorkflowOutput;
