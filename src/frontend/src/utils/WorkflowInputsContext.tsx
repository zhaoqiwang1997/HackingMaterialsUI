// This context is collect all the workflow steps inputs in one place
// It also allows the user to navigate between the different stages' pages without losing their selections in the previous stage page

import React, { useState } from 'react';
import { STEPS_DATA } from '../steps';

type InputValuesType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

type WorkflowInputsContextType = {
  inputValues: InputValuesType;
  setStepInputValue: (stepNumber: string, value: string) => void;
  setStepOutdatedStatus: (stepNumber: string, outdatedStatus: boolean) => void;
};

// Returns an obect mapping each step key to the initial value for that step, as defined in STEPS_DATA
const initialInputsValues: InputValuesType = () =>
  Object.entries(STEPS_DATA).reduce(
    (res, [, values]) => ({
      ...res,
      [values.number]: {
        value: values.initialValue,
        outdatedStatus: false,
      },
    }),
    {},
  );

const WorkflowInputsContext = React.createContext<WorkflowInputsContextType>(
  {} as WorkflowInputsContextType,
);

// The following provider needs to wrap all the components that need to access the data stored in the context
export function WorkflowInputsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [inputValues, setInputValues] = useState(initialInputsValues);

  const setStepInputValue = (stepNumber: string, value: string) => {
    setInputValues((prevValues) => {
      return {
        ...prevValues,
        [stepNumber]: {
          ...prevValues[stepNumber],
          value: value,
        },
      };
    });
  };

  const setStepOutdatedStatus = (
    stepNumber: string,
    outdatedStatus: boolean,
  ) => {
    setInputValues((prevValues) => {
      return {
        ...prevValues,
        [stepNumber]: {
          ...prevValues[stepNumber],
          outdatedStatus: outdatedStatus,
        },
      };
    });
  };

  return (
    <WorkflowInputsContext.Provider
      value={{ inputValues, setStepInputValue, setStepOutdatedStatus }}
    >
      {children}
    </WorkflowInputsContext.Provider>
  );
}

// The following hook is to be used inside each component that needs to access the data stored in the context
// Usage example: const { inputValues, setInputValues } = useWorkflowInputs();
export const useWorkflowInputs = () => React.useContext(WorkflowInputsContext);
