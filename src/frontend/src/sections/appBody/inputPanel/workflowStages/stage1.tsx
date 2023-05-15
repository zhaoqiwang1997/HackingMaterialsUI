import React from 'react';
import {
  DatasetSelection,
  FeaturizerSelection,
  ColumnSelection,
} from '../../../../steps';

const StageOne: React.FC = () => {
  return (
    <>
      <DatasetSelection />
      <ColumnSelection />
      <FeaturizerSelection />
    </>
  );
};

export default StageOne;
