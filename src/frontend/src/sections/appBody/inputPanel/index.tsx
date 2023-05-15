import React, { useMemo } from 'react';
import { Container, ScrollContainer, StickyButtons } from './styled';
import { WorkflowInputsProvider } from '../../../utils/WorkflowInputsContext';
import Button from '../../../components/Button';
import ExecutionButton from '../../../components/ExecutionButton';
import STAGES_DATA from './data';

type InputPanelProps = {
  currentStage: number;
  setStage: (stage: number) => void;
};

function InputPanel(props: InputPanelProps) {
  const { currentStage, setStage } = props;
  const stageNavigationButton = useMemo(() => {
    return (
      <>
        {currentStage > 1 && (
          <Button label="<<" onClick={() => setStage(currentStage - 1)} />
        )}
        {currentStage < 3 && (
          <Button label=">>" onClick={() => setStage(currentStage + 1)} />
        )}
      </>
    );
  }, [currentStage, setStage]);

  const WorkflowSteps = useMemo(() => {
    return STAGES_DATA[currentStage].stageComponent;
  }, [currentStage]);

  return (
    <Container>
      <WorkflowInputsProvider>
        <ScrollContainer>
          <WorkflowSteps />
        </ScrollContainer>
        <StickyButtons>
          <ExecutionButton
            stageNumber={currentStage}
            requiredStepNumbers={STAGES_DATA[currentStage].requiredSteps}
            executionApiEndpoint={STAGES_DATA[currentStage].executionEndpoint}
          />
          {stageNavigationButton}
        </StickyButtons>
      </WorkflowInputsProvider>
    </Container>
  );
}

export default InputPanel;
