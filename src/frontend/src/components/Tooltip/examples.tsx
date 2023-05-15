import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import TooltipComponent from './index';

export default {
  title: 'Reusable Components/Tooltip',
  component: TooltipComponent,
  argTypes: {
    triggers: {
      control: { type: 'inline-check' },
      options: ['hover', 'click', 'focus'],
    },
  },
  args: {
    content:
      'This is helpful information. There is no default value for this content.',
    triggers: ['hover'],
    placement: 'top',
  },
} as ComponentMeta<typeof TooltipComponent>;

export const Tooltip: ComponentStory<typeof TooltipComponent> = (args) => (
  <TooltipComponent {...args} />
);
