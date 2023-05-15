import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import DropdownStepTypeComponent from './index';
import { STEPS_DATA } from '../../steps';
import { WorkflowInputsProvider } from '../../utils/WorkflowInputsContext';

export default {
  title: 'Workflow Step Types/Dropdown Step Type',
  component: DropdownStepTypeComponent,
  argTypes: {
    onSubmit: { action: 'clicked' },
  },
  args: {
    stepNumber: STEPS_DATA.DatasetSelection.number,
    title: 'Dataset Select',
    tooltipContent: 'Choose the dataset for your workflow here',
    options: {
      DB1: { name: 'Dataset 1' },
      DB2: { name: 'Dataset 2' },
      DB3: { name: 'Dataset 3' },
    },
  },
} as ComponentMeta<typeof DropdownStepTypeComponent>;

export const DropdownStepType: ComponentStory<
  typeof DropdownStepTypeComponent
> = (args) => (
  <WorkflowInputsProvider>
    <DropdownStepTypeComponent {...args} />
  </WorkflowInputsProvider>
);
