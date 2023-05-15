import { FC } from 'react';
import StageOne from './workflowStages/stage1';
import StageTwo from './workflowStages/stage2';
import StageThree from './workflowStages/stage3';

type StagesDataType = {
  [key: number]: {
    requiredSteps: string[];
    stageComponent: FC;
    executionEndpoint: string;
  };
};

const STAGES_DATA: StagesDataType = {
  1: {
    requiredSteps: ['1.1'],
    stageComponent: StageOne,
    executionEndpoint: '/api/featurize_column',
  },
  2: {
    requiredSteps: ['2.1', '2.2'],
    stageComponent: StageTwo,
    executionEndpoint: '/api/models/execute',
  },
  3: {
    requiredSteps: ['3.1', '3.2'],
    stageComponent: StageThree,
    executionEndpoint: '',
  },
};

export default STAGES_DATA;
