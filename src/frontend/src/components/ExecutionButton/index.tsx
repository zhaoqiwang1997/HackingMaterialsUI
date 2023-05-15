import React, { useEffect, useMemo, useState } from 'react';
import { useWorkflowInputs } from '../../utils/WorkflowInputsContext';
import { useWorkflowOutputs } from '../../utils/WorkflowOutputsContext';
import Button from '../Button';

type ExecutionButtonProps = {
  stageNumber: number;
  requiredStepNumbers: string[];
  executionApiEndpoint: string;
};

function ExecutionButton({
  stageNumber,
  requiredStepNumbers,
  executionApiEndpoint,
}: ExecutionButtonProps) {
  const { inputValues } = useWorkflowInputs();
  const { addTextOutput, removeOutputItem } = useWorkflowOutputs();
  const [isRunning, setIsRunning] = useState(false);
  const [runningStage, setRunningStage] = useState<number | null>(null);
  const [runningParameters, setRunningParameters] = useState<
    typeof inputValues
  >({});
  const backendURI = process.env.REACT_APP_BACKEND_API_URI;

  const onClick = () => {
    setRunningStage(stageNumber);
    setRunningParameters(inputValues);
  };

  const getStyledParameters = () => {
    const stageRegex = new RegExp('1..*', 'g');
    const targetStepKeys = Object.keys(runningParameters).filter(
      (key) => stageRegex.test(key) && runningParameters[key].value !== '',
    );
    return (
      <ul>
        {targetStepKeys.map((key) => (
          <li key={key}>
            Step {key}: {runningParameters[key].value}
          </li>
        ))}
      </ul>
    );
  };

  const isDisabled = useMemo(() => {
    for (const stepNumber of requiredStepNumbers) {
      if (inputValues[stepNumber].value == '') {
        return true;
      }
    }
    return false;
  }, [inputValues, requiredStepNumbers]);

  const checkTaskCompletion = async (taskId: string) => {
    const pollInterval = 5000;

    const pollStatus = async (
      resolve: (value: unknown) => void,
      reject: (reason?: unknown) => void,
    ) => {
      setTimeout(async () => {
        const response = await fetch(backendURI + `/api/task_status/${taskId}`);
        const responseBody = await response.text();
        if (!response.ok || responseBody.trim() === '"error"') {
          return reject(new Error('Exceeded max attempts'));
        } else if (response.status == 202) {
          pollStatus(resolve, reject);
        } else {
          return resolve(response);
        }
      }, pollInterval);
    };
    return new Promise(pollStatus);
  };

  const runExecution = async () => {
    setIsRunning(true);

    try {
      const initiationResponse = await fetch(backendURI + executionApiEndpoint);
      if (!initiationResponse.ok) {
        throw new Error(`Status: ${initiationResponse.status}`);
      }
      const initiationData = await initiationResponse.json();
      if (initiationData.error) {
        throw new Error(initiationData.error);
      }
      await checkTaskCompletion(initiationData.task_id);
      const resultResponse = await fetch(
        backendURI + `task_info/${initiationData.task_id}`,
      );
      const resultData = await resultResponse.json();
      addTextOutput(
        `Stage ${runningStage} was successfully executed. Results: ${resultData.task_result}`,
        'success',
        `stage${runningStage}Execution`,
      );
      addTextOutput(
        <div>
          <span>
            The parameters used for the most recent successful Stage{' '}
            {runningStage} execution were:
          </span>{' '}
          {getStyledParameters()}
        </div>,
        'standard',
        `stage${runningStage}ExecutionParameters`,
      );
    } catch (error) {
      addTextOutput(
        `The following error occured while executing Stage ${runningStage}: ${error}`,
        'error',
        `stage${runningStage}Execution`,
      );
      removeOutputItem(`stage${runningStage}ExecutionParameters`);
    }
    setIsRunning(false);
    setRunningStage(null);
  };

  useEffect(() => {
    if (runningStage) {
      runExecution();
    }
  }, [runningStage]);

  return (
    <Button
      disabled={isDisabled || isRunning}
      label={
        isRunning ? `Running Stage ${runningStage}` : `Run Stage ${stageNumber}`
      }
      onClick={onClick}
    />
  );
}

export default ExecutionButton;
