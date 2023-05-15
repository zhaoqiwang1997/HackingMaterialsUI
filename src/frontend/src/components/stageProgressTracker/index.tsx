import React from 'react';
import { Container, StageItem } from './styled';

type OutputWindowProps = {
  currentStage: number;
  setStage: (stage: number) => void;
};

function StageProgressTracker(props: OutputWindowProps) {
  const { currentStage, setStage } = props;

  const Stage = ({
    stageNumber,
    children,
  }: {
    stageNumber: number;
    children: React.ReactNode;
  }) => (
    <StageItem
      active={currentStage === stageNumber}
      onClick={() => setStage(stageNumber)}
    >
      {children}
    </StageItem>
  );

  return (
    <Container>
      <Stage stageNumber={1}>
        <span>1. Prepare data</span>
      </Stage>
      <Stage stageNumber={2}>
        <span>2. Machine learning</span>
      </Stage>
      <Stage stageNumber={3}>
        <span>3. Visualise results</span>
      </Stage>
    </Container>
  );
}

export default StageProgressTracker;
