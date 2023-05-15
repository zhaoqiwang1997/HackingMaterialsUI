import React from 'react';
import { AxesSelection } from '../../../../steps/axesSelection';
import { HistPlotStep } from '../../../../steps/histogramPlotStep/histPlotStep';
import { ScatterPlotStep } from '../../../../steps/plotSteps/scatterPlot';
import { RegLinePlotStep } from '../../../../steps/plotSteps/regressionLinePlot';

const StageThree: React.FC = () => {
  return (
    <>
      <AxesSelection />
      <ScatterPlotStep />
      <RegLinePlotStep />
      <HistPlotStep />
    </>
  );
};

export default StageThree;
