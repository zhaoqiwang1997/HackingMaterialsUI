import React, { useState } from 'react';
import { Scatter } from '@ant-design/plots';
import { Datum } from '@ant-design/charts';
import { useWorkflowOutputs } from '../../../utils/WorkflowOutputsContext';
import { STEPS_DATA } from '../../data';
import ButtonStepType from '../../../components/ButtonStepType';
import DropdownSelectStepType from '../../../components/dropdownStepType';
import data from '../plottingData';

export function RegLinePlotStep() {
  const { addTextOutput, addCustomOutput } = useWorkflowOutputs(); // util to for app body output
  const [regressionType, setRegressionType] = useState('linear');
  const regLineTypeStepKey = STEPS_DATA.RegLineType.number;
  const regLinePlotStepKey = STEPS_DATA.RegLinePlot.number;

  const optionsList = {
    linear: { name: 'Linear' },
    exp: { name: 'Exponential' },
    loess: { name: 'Loess' },
    log: { name: 'Logarithmic' },
    poly: { name: 'Polynomial' },
    pow: { name: 'Power' },
    quad: { name: 'Quadratic' },
  };

  const onSubmit = async (selectedValue: string) => {
    setRegressionType(selectedValue);
    addTextOutput(
      'Your selection was successfully saved.',
      'success',
      'selectionSaveStatus',
      regLineTypeStepKey,
    );
  };

  const onClickReg = async () => {
    try {
      const regPlotConfig = {
        data,
        xField: 'x',
        yField: 'y',

        xAxis: {
          title: {
            text: data[0].x_axis,
          },
        },

        yAxis: {
          title: {
            text: data[0].y_axis,
          },
        },

        tooltip: {
          fields: ['x', 'y', 'formula'],
          formatter: (datum: Datum) => {
            return {
              name: datum.formula,
              value: '(' + datum.x + ', ' + datum.y + ')' + '\n',
            };
          },

          showMarkers: false,
        },

        size: 0,
        pointStyle: {
          stroke: '#777777',
          lineWidth: 1,
          fill: '#5B8FF9',
        },

        brush: {
          enabled: true,
          mask: {
            style: {
              fill: 'rgba(255,0,0,0.15)',
            },
          },
        },

        regressionLine: {
          type: regressionType, // linear, exp, loess, log, poly, pow, quad
        },
      };

      addCustomOutput(
        <Scatter {...regPlotConfig}></Scatter>,
        'Regression line for ' + data[0].x_axis + ' against ' + data[0].y_axis,
        regLinePlotStepKey,
      );
    } catch (error) {
      addTextOutput(
        `The following error occured while plotting data: ${error}`,
        'error',
        'plotStatus',
        regLinePlotStepKey,
      );
    }
  };

  return (
    <React.Fragment>
      <DropdownSelectStepType
        stepNumber={regLineTypeStepKey}
        title="Select the type of regression function"
        tooltipContent={
          'This is the type of regression line to fit the data points.'
        }
        options={optionsList}
        onSubmit={onSubmit}
      />
      <ButtonStepType
        stepNumber={regLinePlotStepKey}
        buttonLabel="Plot"
        title="Create regression plot"
        tooltipContent="The regression plot shows regression line of the selected result."
        loading={false}
        onClick={onClickReg}
      />
    </React.Fragment>
  );
}
