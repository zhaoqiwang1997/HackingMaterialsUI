import React, { useCallback, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import Button from '../../components/Button';
import DropdownSelectStepType, {
  Options,
} from '../../components/dropdownStepType';
import { useWorkflowOutputs } from '../../utils/WorkflowOutputsContext';
import { STEPS_DATA } from '../data';
import { ModalContentContainer } from './styled';
import CitationsList from '../../components/CitationsList';

export function FeaturizerSelection() {
  const stepKey = STEPS_DATA.FeaturizerSelection.number;
  const [optionsList, setOptionsList] = useState<Options>({});
  const [isSending, setIsSending] = useState(false);
  const [fetchOptionsErroring, setFetchOptionsErroring] = useState(false); // state used to manage fetch error output message
  const { addTextOutput, removeOutputItem } = useWorkflowOutputs();
  const backendURI = process.env.REACT_APP_BACKEND_API_URI;

  const fetchOptions = useCallback(() => {
    const callApi = async () => {
      try {
        const respnse = await fetch(backendURI + '/api/featurizers');
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
          An error occured while fetching the available featurizers list. <br />{' '}
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
      const response = await fetch(backendURI + '/api/featurizers/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          featurizer: selectedValue,
        }),
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

  const getFeaturizerInfo = async (selectedValue: string) => {
    try {
      const response = await fetch(
        backendURI + `/api/featurizers/info/${selectedValue}`,
      );

      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      return (
        <ModalContentContainer>
          <h3>Citations</h3>
          <CitationsList bibtexCitations={data.citations} />
          <h3>Implementors</h3>
          {data.implementors.join(', ')}
          <h3>Labels</h3>
          {data.feature_labels.join(', ')}
          <h3>More information</h3>
          {React.createElement('div', {
            dangerouslySetInnerHTML: {
              __html: DOMPurify.sanitize(data.help_text),
            },
          })}
        </ModalContentContainer>
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        <div>The following error occured: {error.message}</div>;
      } else {
        return <div>An error occured while fetching the information.</div>;
      }
    }
  };

  return (
    <DropdownSelectStepType
      stepNumber={stepKey}
      title="Select a featurizer"
      tooltipContent="The featurizer uses existing data to infer new features"
      selectionInfoButtonConfig={{
        label: 'Featurizer details',
        action: getFeaturizerInfo,
      }}
      loading={isSending}
      options={optionsList}
      onSubmit={onSubmit}
    />
  );
}
