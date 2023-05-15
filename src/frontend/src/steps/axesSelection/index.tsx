import React, { useCallback, useEffect, useState } from 'react';
import Button from '../../components/Button';
import DropdownSelectStepType, {
  Options,
} from '../../components/dropdownStepType';
import { useWorkflowOutputs } from '../../utils/WorkflowOutputsContext';
import { STEPS_DATA } from '../data';

export function AxesSelection() {
  const xStepKey = STEPS_DATA.XAxisSelection.number;
  const yStepKey = STEPS_DATA.YAxisSelection.number;
  const [optionsList, setOptionsList] = useState<Options>({});
  const [isSendingX, setIsSendingX] = useState(false);
  const [isSendingY, setIsSendingY] = useState(false);
  const [fetchOptionsErroring, setFetchOptionsErroring] = useState(false); // state used to manage fetch error output message
  const { addTextOutput, removeOutputItem } = useWorkflowOutputs();
  const backendURI = process.env.REACT_APP_BACKEND_API_URI;

  // fetch axes options
  const fetchOptions = useCallback(() => {
    const callApi = async () => {
      try {
        const respnse = await fetch(backendURI + '/api/getFeatures');
        const data = await respnse.json();
        setOptionsList(data);
        setFetchOptionsErroring(false);
      } catch (error) {
        setFetchOptionsErroring(true);
      }
    };
    callApi();
  }, []);

  useEffect(() => fetchOptions(), [fetchOptions]); // call fetchOptions when the component first loads

  // For both x and y axes: whenever fetchOptionsErroring state updates, either add an error
  // message output item or remove it (based on the state value)
  useEffect(() => {
    if (fetchOptionsErroring) {
      const errorMessage = (
        <>
          An error occured while fetching the available feature list. <br />{' '}
          <br />
          <Button label="Try again" onClick={fetchOptions} />
        </>
      );
      addTextOutput(errorMessage, 'error', 'fetchOptionsError', xStepKey);
      addTextOutput(errorMessage, 'error', 'fetchOptionsError', yStepKey);
    } else {
      removeOutputItem('fetchOptionsError', xStepKey); // remove error message if one was previously added
      removeOutputItem('fetchOptionsError', yStepKey); // remove error message if one was previously added
    }
  }, [
    addTextOutput,
    fetchOptions,
    fetchOptionsErroring,
    removeOutputItem,
    xStepKey,
    yStepKey,
  ]);

  const onSubmitX = async (selectedValue: string) => {
    setIsSendingX(true);
    try {
      const response = await fetch(backendURI + '/api/selectXAxis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ xAxis: selectedValue }),
      });

      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      addTextOutput(
        'Your selection of x axis was successfully saved.',
        'success',
        'selectionSaveStatus',
        xStepKey,
      );
    } catch (error) {
      addTextOutput(
        `The following error occured while saving your selection: ${error}`,
        'error',
        'selectionSaveStatus',
        xStepKey,
      );
    }
    setIsSendingX(false);
  };

  const onSubmitY = async (selectedValue: string) => {
    setIsSendingY(true);
    try {
      const response = await fetch(backendURI + '/api/selectYAxis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ yAxis: selectedValue }),
      });

      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      addTextOutput(
        'Your selection of y axis was successfully saved.',
        'success',
        'selectionSaveStatus',
        yStepKey,
      );
    } catch (error) {
      addTextOutput(
        `The following error occured while saving your selection: ${error}`,
        'error',
        'selectionSaveStatus',
        yStepKey,
      );
    }
    setIsSendingY(false);
  };

  return (
    <React.Fragment>
      <DropdownSelectStepType
        stepNumber={xStepKey}
        title="Select a feature to plot for x axis"
        tooltipContent={'This is the feature that will be plotted as x axis'}
        loading={isSendingX}
        options={optionsList}
        onSubmit={onSubmitX}
      />
      <DropdownSelectStepType
        stepNumber={yStepKey}
        title="Select a feature to plot for y axis"
        tooltipContent={'This is the feature that will be plotted as y axis'}
        loading={isSendingY}
        options={optionsList}
        onSubmit={onSubmitY}
      />
    </React.Fragment>
  );
}
