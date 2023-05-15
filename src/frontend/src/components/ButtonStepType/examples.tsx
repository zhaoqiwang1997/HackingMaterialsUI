import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ButtonStepTypeComponent from './index';
import { STEPS_DATA } from '../../steps';
import { WorkflowInputsProvider } from '../../utils/WorkflowInputsContext';

export default {
  title: 'Workflow Step Types/Button Step Type',
  component: ButtonStepTypeComponent,
  argTypes: {
    onClick: { action: 'clicked' },
  },
  args: {
    stepNumber: STEPS_DATA.ScatterPlot.number,
    title: 'Create scatter plot',
    tooltipContent: 'Create scatter plotfor selected axes',
    buttonLabel: 'Plot',
  },
} as ComponentMeta<typeof ButtonStepTypeComponent>;

export const ButtonStepType: ComponentStory<typeof ButtonStepTypeComponent> = (
  args,
) => (
  <WorkflowInputsProvider>
    <ButtonStepTypeComponent {...args} />
  </WorkflowInputsProvider>
);
