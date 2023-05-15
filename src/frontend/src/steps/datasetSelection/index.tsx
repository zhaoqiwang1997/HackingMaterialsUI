import React, { useCallback, useEffect, useState } from 'react';
import Button from '../../components/Button';
import DropdownSelectStepType, {
  Options,
} from '../../components/dropdownStepType';
import { useWorkflowOutputs } from '../../utils/WorkflowOutputsContext';
import { STEPS_DATA } from '../data';

export function DatasetSelection() {
  const stepKey = STEPS_DATA.DatasetSelection.number;
  const [optionsList, setOptionsList] = useState<Options>({});
  const [isSending, setIsSending] = useState(false);
  const [fetchOptionsErroring, setFetchOptionsErroring] = useState(false); // state used to manage fetch error output message
  const { addTextOutput, removeOutputItem } = useWorkflowOutputs();
  const backendURI = process.env.REACT_APP_BACKEND_API_URI;

  const fetchOptions = useCallback(() => {
    const callApi = async () => {
      try {
        const response = await fetch(backendURI + '/api/datasets');
        const data = await response.json();
        setOptionsList(data);
        setFetchOptionsErroring(false);
      } catch (error) {
        setFetchOptionsErroring(true);
      }
    };
    callApi();
  }, []);

  useEffect(() => fetchOptions(), [fetchOptions]); // call fetchOptions when the component first loads

  // whenever fetchOptionsErroring state updates, either add an error message output item or remove it (based on the state value)
  useEffect(() => {
    if (fetchOptionsErroring) {
      const errorMessage = (
        <>
          An error occured while fetching the available datasets list. <br />{' '}
          <br />
          <Button label="Try again" onClick={fetchOptions} />
        </>
      );
      addTextOutput(errorMessage, 'error', 'fetchOptionsError', stepKey);
    } else {
      removeOutputItem('fetchOptionsError', stepKey); // remove error message if one was previously added
    }
  }, [
    addTextOutput,
    fetchOptions,
    fetchOptionsErroring,
    removeOutputItem,
    stepKey,
  ]);

  const onSubmit = async (selectedValue: string) => {
    setIsSending(true);
    try {
      const response = await fetch(backendURI + '/api/datasets/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dataset: selectedValue }),
      });

      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      addTextOutput(
        'Your selection was successfully saved.',
        'success',
        'selectionSaveStatus',
        stepKey,
      );
    } catch (error) {
      addTextOutput(
        `The following error occured while saving your selection: ${error}`,
        'error',
        'selectionSaveStatus',
        stepKey,
      );
    }
    setIsSending(false);
  };

  return (
    <DropdownSelectStepType
      stepNumber={stepKey}
      title="Select a dataset"
      tooltipContent="This is the dataset on which the future operaions will be performed"
      loading={isSending}
      options={optionsList}
      onSubmit={onSubmit}
    />
  );
}
