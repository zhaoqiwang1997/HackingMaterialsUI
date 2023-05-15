import React, { useMemo } from 'react';
import StageProgressTracker from '../../../components/stageProgressTracker';
import { useWorkflowOutputs } from '../../../utils/WorkflowOutputsContext';
import {
  Container,
  GlobalOutputsContainer,
  OutputsContianer,
  StepOutputsContainer,
} from './styled';

type OutputWindowProps = {
  currentStage: number;
  setStage: (stage: number) => void;
};

function OutputWindow(props: OutputWindowProps) {
  const { currentStage, setStage } = props;
  const { workflowOutputs } = useWorkflowOutputs();

  const outputItems = useMemo(() => {
    const { globalOutputs, ...stepsOutputs } = workflowOutputs;

    return (
      <OutputsContianer>
        {globalOutputs && (
          <GlobalOutputsContainer>
            {Object.values(globalOutputs)}
          </GlobalOutputsContainer>
        )}

        {/* A sorting function needs to be provided below as the default sorting fucntion would incorretly put 10 before 2 */}
        {stepsOutputs &&
          Object.keys(stepsOutputs)
            .sort(function (a, b) {
              return parseFloat(a) - parseFloat(b);
            })
            .map((stepNumber) => (
              <StepOutputsContainer key={stepNumber}>
                <h2 key={stepNumber}>Step {stepNumber} output:</h2>
                {Object.values(stepsOutputs[stepNumber])}
              </StepOutputsContainer>
            ))}
      </OutputsContianer>
    );
  }, [workflowOutputs]);

  return (
    <Container>
      <StageProgressTracker currentStage={currentStage} setStage={setStage} />
      {outputItems}
    </Container>
  );
}

export default OutputWindow;
