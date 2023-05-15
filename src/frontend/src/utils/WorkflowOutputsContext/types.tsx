import { TextWorkflowOutputType } from '../../components/TextWorkflowOutput';

export type OutputItems = {
  [key: string]: React.ReactNode;
};

export type WorkflowOutputsType = {
  [key: string]: OutputItems;
};

export type AddCustomOutputType = (
  outputItem: React.ReactNode,
  outputKey: string,
  stepNumber?: string,
) => void;

export type AddTextOutputType = (
  content: React.ReactNode,
  type: TextWorkflowOutputType,
  outputKey: string,
  stepNumber?: string,
) => void;

export type RemoveOutputItemType = (
  outputKey: string,
  stepKey?: string,
) => void;

export type WorkflowOutputsContextType = {
  workflowOutputs: WorkflowOutputsType;
  addCustomOutput: AddCustomOutputType;
  addTextOutput: AddTextOutputType;
  removeOutputItem: RemoveOutputItemType;
  clearOutputsGroup: (stepNumber?: string) => void;
  clearAllOutputs: () => void;
};
