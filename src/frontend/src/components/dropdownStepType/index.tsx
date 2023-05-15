import React, { ReactNode, useMemo, useState } from 'react';
import useModal from '../../hooks/useModal';
import BaseStepInterface from '../../utils/BaseStepInterface';
import { useWorkflowInputs } from '../../utils/WorkflowInputsContext';
import Button from '../Button';
import Modal from '../Modal';
import Tooltip from '../Tooltip';
import { Container, Select, StepHeader } from './styled';

export type Options = {
  [key: string]: {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
};

interface DropdownStepTypeProps extends BaseStepInterface {
  loading?: boolean;
  options: Options | string[]; //string[] type is added because dataset columns are not of Options type but array of string type
  selectionInfoButtonConfig?: {
    label: string;
    action: (selectedValue: string) => Promise<ReactNode | undefined>;
  };
  onSubmit: (selectedValue: string) => void;
}

function DropdownStepType({
  stepNumber,
  title,
  tooltipContent,
  loading = false,
  options,
  selectionInfoButtonConfig,
  onSubmit,
}: DropdownStepTypeProps) {
  const { inputValues, setStepInputValue, setStepOutdatedStatus } =
    useWorkflowInputs();
  const [selectedValue, setSelectedValue] = useState(
    inputValues[stepNumber].value,
  );
  const [isDisabled, setIsDisabled] = useState(true);
  const [infoModalContent, setInfoModalContent] = useState<ReactNode>();
  const { isShowing, toggle } = useModal();

  const optionElements = useMemo(() => {
    if (Object.keys(options).length === 0) {
      setIsDisabled(true);
      return (
        <option value="" disabled hidden>
          Fetching options...
        </option>
      );
    }
    setIsDisabled(false);
    return (
      <>
        <option value="" disabled hidden>
          Please select an option
        </option>

        {Object.entries(options).map(([key, value]) => (
          <option key={key} value={value.name ? key : value}>
            {/* value.name is for displaying dataset(step1.1) and featurizer(step1.3) options which are of Options type and value is used for column(step 1.2) options which are of string[] type */}
            {value.name ? value.name : value}
          </option>
        ))}
      </>
    );
  }, [options]);

  const handleOnSubmit = () => {
    if (inputValues[stepNumber].value !== selectedValue) {
      setStepInputValue(stepNumber, selectedValue);
      setStepOutdatedStatus(stepNumber, false);
    }
    onSubmit(selectedValue);
  };

  const handleInfoButtonClick = async () => {
    if (selectionInfoButtonConfig) {
      toggle();
      const content = await selectionInfoButtonConfig.action(selectedValue);
      setInfoModalContent(content);
    }
  };

  const updateStatus = (value: string) => {
    setSelectedValue(value);
    if (inputValues[stepNumber].value === value) {
      setStepOutdatedStatus(stepNumber, false);
    } else {
      setStepOutdatedStatus(stepNumber, true);
    }
  };

  return (
    <Container>
      <StepHeader>
        <label htmlFor={stepNumber}>
          Step {stepNumber}: {title}
        </label>
        <Tooltip placement="right" content={tooltipContent} />
      </StepHeader>
      <Select
        name={stepNumber}
        value={selectedValue}
        disabled={isDisabled}
        onChange={(event) => updateStatus(event.target.value)}
      >
        {optionElements}
      </Select>
      {selectionInfoButtonConfig ? (
        <>
          <Modal isShowing={isShowing} hide={toggle}>
            {infoModalContent}
          </Modal>
          <Button
            disabled={loading || selectedValue === ''}
            onClick={handleInfoButtonClick}
            label={selectionInfoButtonConfig.label}
          />
        </>
      ) : null}
      <Button
        disabled={loading || selectedValue === ''}
        primary
        onClick={handleOnSubmit}
        label={loading ? 'Loading' : 'Save'}
      />
    </Container>
  );
}

export default DropdownStepType;
