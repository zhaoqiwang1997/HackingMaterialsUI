import React, { useCallback, useEffect, useState } from 'react';
import Button from '../../components/Button';
import DropdownSelectStepType, {
  Options,
} from '../../components/dropdownStepType';
import { useWorkflowOutputs } from '../../utils/WorkflowOutputsContext';
import { STEPS_DATA } from '../data';

export function PredictingColumnSelection() {
  const stepKey = STEPS_DATA.PredictingColumnSelection.number;
  const [isSending, setIsSending] = useState(false);
  const [optionsList, setOptionsList] = useState<Options>({});
  const [fetchOptionsErroring, setFetchOptionsErroring] = useState(false); // state used to manage fetch error output message
  const { addTextOutput, removeOutputItem } = useWorkflowOutputs();
  const backendURI = process.env.REACT_APP_BACKEND_API_URI;

  //fetch property options
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

  // whenever fetchOptionsErroring state updates, either add an error message output item or remove it (based on the state value)
  useEffect(() => {
    if (fetchOptionsErroring) {
      const errorMessage = (
        <>
          An error occured while fetching the available feature list. <br />{' '}
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
      await fetch(backendURI + '/api/selectPredictingColumn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ predictingColumn: selectedValue }),
      });
      addTextOutput(
        'Your selection of property was successfully saved.',
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
      title="Select a property you want to predict"
      tooltipContent="This is the property the model will predict"
      loading={isSending}
      options={optionsList}
      onSubmit={onSubmit}
    />
  );
}
