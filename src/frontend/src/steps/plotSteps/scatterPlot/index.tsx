import React from 'react';
import { Scatter } from '@ant-design/plots';
import { Datum } from '@ant-design/charts';
import { useWorkflowOutputs } from '../../../utils/WorkflowOutputsContext';
import { STEPS_DATA } from '../../data';
import ButtonStepType from '../../../components/ButtonStepType';
import data from '../plottingData';

export function ScatterPlotStep() {
  const { addTextOutput, addCustomOutput } = useWorkflowOutputs(); // util to for app body output
  const scatterPlotStepKey = STEPS_DATA.ScatterPlot.number;

  const onClickScatter = async () => {
    try {
      const scatterConfig = {
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

        size: 5,
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
      };
      addCustomOutput(
        <Scatter {...scatterConfig}></Scatter>,
        'Scatter plot for ' + data[0].x_axis + ' against ' + data[0].y_axis,
        scatterPlotStepKey,
      );
    } catch (error) {
      addTextOutput(
        `The following error occured while plotting data: ${error}`,
        'error',
        'plotStatus',
        scatterPlotStepKey,
      );
    }
  };

  return (
    <ButtonStepType
      stepNumber={scatterPlotStepKey}
      buttonLabel="Plot"
      title="Create scatter plot"
      tooltipContent="The scatter plot shows selected feature y against x"
      loading={false}
      onClick={onClickScatter}
    />
  );
}
