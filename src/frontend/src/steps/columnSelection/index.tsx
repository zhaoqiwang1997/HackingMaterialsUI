import React, { useCallback, useEffect, useState } from 'react';
import Button from '../../components/Button';
import DropdownSelectStepType from '../../components/dropdownStepType';
import { useWorkflowInputs } from '../../utils/WorkflowInputsContext';
import { useWorkflowOutputs } from '../../utils/WorkflowOutputsContext';
import { STEPS_DATA } from '../data';

export function ColumnSelection() {
  const stepKey = STEPS_DATA.ColumnSelection.number;
  const [isSending, setIsSending] = useState(false);
  const datasetsStepKey = STEPS_DATA.DatasetSelection.number;
  const { inputValues } = useWorkflowInputs(); //used to get the saved dataset
  const [optionsList, setOptionsList] = useState([]);
  const [fetchOptionsErroring, setFetchOptionsErroring] = useState(false); // state used to manage fetch error output message
  const { addTextOutput, removeOutputItem } = useWorkflowOutputs();
  const backendURI = process.env.REACT_APP_BACKEND_API_URI;

  const fetchOptions = useCallback((selectedDataset: string) => {
    const callApi = async () => {
      try {
        const response = await fetch(backendURI + 'api/dataset-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ dataset: selectedDataset }),
        });
        const data = await response.json();
        setOptionsList(data);
        setFetchOptionsErroring(false);
      } catch (error) {
        setFetchOptionsErroring(true);
      }
    };
    if (selectedDataset) {
      callApi();
    }
  }, []);

  useEffect(() => {
    const datasetSelectionData = inputValues[datasetsStepKey];
    if (datasetSelectionData.outdatedStatus) {
      setOptionsList([]);
    } else {
      const dataset = datasetSelectionData.value;
      fetchOptions(dataset);
    }
  }, [fetchOptions, inputValues[datasetsStepKey]]); // call fetchOptions when the component first loads as well as when dataset is getting saved

  // whenever fetchOptionsErroring state updates, either add an error message output item or remove it (based on the state value)
  useEffect(() => {
    if (fetchOptionsErroring) {
      const errorMessage = (
        <>
          An error occured while fetching the available dataset column list.{' '}
          <br /> <br />
          <Button
            label="Try again"
            onClick={() => fetchOptions(inputValues[datasetsStepKey].value)}
          />
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
      const response = await fetch(backendURI + 'api/datasets/column/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ column_to_featurize: selectedValue }),
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
      title="Select a dataset column"
      tooltipContent="This is the list of columns of the saved dataset"
      loading={isSending}
      options={optionsList}
      onSubmit={onSubmit}
    />
  );
}
