import React, { useState } from 'react';
import DropdownSelectStepType from '../../components/dropdownStepType';
import { useWorkflowOutputs } from '../../utils/WorkflowOutputsContext';
import { STEPS_DATA } from '../data';

export function MLModelSelection() {
  const stepKey = STEPS_DATA.MLModelSelction.number;
  const optionsList = {
    rf: { name: 'Random Forest' },
    lr: { name: 'Linear Regression' },
    gb: { name: 'Gradient Boosting Regressor' },
    svr: { name: 'SVR' },
    br: { name: 'Bayesian Ridge' },
    sgd: { name: 'SGD Regressor' },
    xgb: { name: 'XGB Regressor' },
    lgb: { name: 'LGBM Regressor' },
    kr: { name: 'Ridge' },
    gp: { name: 'Gaussian Process Regressor' },
  }; //hard-coded options
  const [isSending, setIsSending] = useState(false);
  const { addTextOutput } = useWorkflowOutputs(); // util to for app body output
  const backendURI = process.env.REACT_APP_BACKEND_API_URI;

  const onSubmit = async (selectedValue: string) => {
    setIsSending(true);
    try {
      const response = await fetch(backendURI + '/api/models/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model: selectedValue }),
      });

      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      //app body output
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
      title="Select a machine learning model"
      tooltipContent={
        'This is the machine learning model with which the data will be trained and predicted.'
      }
      loading={isSending}
      options={optionsList}
      onSubmit={onSubmit}
    />
  );
}
