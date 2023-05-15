import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import StageProgressTrackerComponent from './index';

export default {
  title: 'Reusable Components/StageProgressTracker',
  component: StageProgressTrackerComponent,
  argTypes: {
    setStage: { action: 'clicked' },
  },
  args: {
    currentStage: 1,
  },
} as ComponentMeta<typeof StageProgressTrackerComponent>;

export const StageProgressTracker: ComponentStory<
  typeof StageProgressTrackerComponent
> = (args) => <StageProgressTrackerComponent {...args} />;
