import React from 'react';
import { Column } from '@ant-design/plots';
import { STEPS_DATA } from '../data';
import { useWorkflowOutputs } from '../../utils/WorkflowOutputsContext';
import ButtonStepType from '../../components/ButtonStepType';

export function HistPlotStep() {
  const stepKey = STEPS_DATA.HistPlot.number;
  const { addCustomOutput } = useWorkflowOutputs();
  const data = [
    {
      feature: 'MagpieData mean MeltingT',
      Importance: 0.5,
    },
    {
      feature: 'Vpa',
      Importance: 0.18,
    },
    {
      feature: 'MagpieData minimum MeltingT',
      Importance: 0.08,
    },
    {
      feature: 'density',
      Importance: 0.056,
    },
    {
      feature: 'MagpieData maximun MeltingT',
      Importance: 0.04,
    },
    {
      feature: 'MagpieData mean Electronegativity',
      Importance: 0.021,
    },
  ];

  const config = {
    data,
    xField: 'feature',
    yField: 'Importance',

    yAxis: {
      title: {
        text: 'Importance (%)',
      },
    },

    xAxis: {
      title: {
        text: 'Feature',
      },
      label: {
        autoHide: false,
        autoRotate: true,
        style: {
          fontSize: 15,
        },
      },
    },

    label: {
      style: {
        fontSize: 10,
      },
    },

    meta: {
      type: {
        alias: 'feature',
      },
      sales: {
        alias: 'importance',
      },
    },
  };

  const onClick = async () => {
    addCustomOutput(
      <Column {...config} />,
      'Histogram for feature importance in selected model',
      stepKey,
    );
  };

  return (
    <ButtonStepType
      stepNumber={stepKey}
      buttonLabel="Plot"
      title="Create histogram"
      tooltipContent="The histogram shows feature importance after training in selected model"
      loading={false}
      onClick={onClick}
    />
  );
}
