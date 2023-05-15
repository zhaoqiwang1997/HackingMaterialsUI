import React from 'react';
import { MLModelSelection } from '../../../../steps/mlModelSelection';
import { PredictingColumnSelection } from '../../../../steps/predictingColumnSelection';

const StageTwo: React.FC = () => {
  return (
    <>
      <MLModelSelection />
      <PredictingColumnSelection />
    </>
  );
};

export default StageTwo;
