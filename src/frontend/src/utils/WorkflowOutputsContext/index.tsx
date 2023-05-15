// This context is collect all the workflow steps inputs in one place
// It also allows the user to navigate between the different stages' pages without losing their selections in the previous stage page

import React, { useCallback, useState } from 'react';
import TextWorkflowOutput from '../../components/TextWorkflowOutput';
import {
  AddCustomOutputType,
  AddTextOutputType,
  RemoveOutputItemType,
  WorkflowOutputsContextType,
  WorkflowOutputsType,
} from './types';

const WorkflowOutputsContext = React.createContext<WorkflowOutputsContextType>(
  {} as WorkflowOutputsContextType,
);

const GLOBAL_OUTPUTS_KEY = 'globalOutputs';

// The following provider needs to wrap all the components that need to access the data stored in the context
export function WorkflowOutputProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [workflowOutputs, setWorkflowOutputs] = useState<WorkflowOutputsType>(
    {} as WorkflowOutputsType,
  );

  // Adds a ReactNode as an output in the group specified by the stepKey
  // If no stepKey is provided, it adds the content to the global outputs group by default
  // Add additional items by using a new outputKey. Override an existing item by adding new content with the same outputKey.
  const addCustomOutput: AddCustomOutputType = useCallback(
    (outputItem, outputKey, stepKey = GLOBAL_OUTPUTS_KEY) => {
      setWorkflowOutputs((prev) => {
        return {
          ...prev,
          [stepKey]: {
            ...prev[stepKey],
            [outputKey]: outputItem,
          },
        };
      });
    },
    [],
  );

  // Adds a TextWorkflowOutput component with the provided text or ReactNode content as an output in the group specified by the stepKey
  // If no stepKey is provided, it adds the content to the global outputs group by default
  // Add additional items by using a new outputKey. Override an existing item by adding new content with the same outputKey.
  const addTextOutput: AddTextOutputType = useCallback(
    (content, type, outputKey, stepKey = GLOBAL_OUTPUTS_KEY) => {
      const outputItem = (
        <TextWorkflowOutput key={stepKey + outputKey} type={type}>
          {content}
        </TextWorkflowOutput>
      );
      addCustomOutput(outputItem, outputKey, stepKey);
    },
    [addCustomOutput],
  );

  // Clears the outputs of the group specified by the stepKey
  // If no stepKey is provided, it clears the global outputs group by default
  const clearOutputsGroup = useCallback((stepKey = GLOBAL_OUTPUTS_KEY) => {
    setWorkflowOutputs((prev) => {
      const current = { ...prev };
      delete current[stepKey];
      return current;
    });
  }, []);

  // Clears a specific output item specified by an outputKey and stepKey
  // If no stepKey is provided, it looks for the ouputKey in the global outputs group by default
  const removeOutputItem: RemoveOutputItemType = useCallback(
    (outputKey, stepKey = GLOBAL_OUTPUTS_KEY) => {
      setWorkflowOutputs((prev) => {
        const current = { ...prev };
        const groupItems = current[stepKey];
        if (groupItems) {
          if (Object.keys(groupItems).length === 1) {
            delete current[stepKey];
            return current;
          }
          delete current[stepKey][outputKey];
        }
        return current;
      });
    },
    [],
  );

  // Clears all outputs in the window
  const clearAllOutputs = useCallback(() => {
    setWorkflowOutputs({});
  }, []);

  return (
    <WorkflowOutputsContext.Provider
      value={{
        workflowOutputs,
        addCustomOutput,
        addTextOutput,
        removeOutputItem,
        clearOutputsGroup,
        clearAllOutputs,
      }}
    >
      {children}
    </WorkflowOutputsContext.Provider>
  );
}

// The following hook is to be used inside each component that needs to access the data stored in the context
export const useWorkflowOutputs = () =>
  React.useContext(WorkflowOutputsContext);
