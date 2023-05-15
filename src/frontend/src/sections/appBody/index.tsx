import React, { useState } from 'react';
import InputPanel from './inputPanel';
import OutputWindow from './outputWindow';
import { Container } from './styled';

function AppBody() {
  const [currentStage, setCurrentStage] = useState(1);

  return (
    <>
      <Container>
        <InputPanel currentStage={currentStage} setStage={setCurrentStage} />
        <OutputWindow currentStage={currentStage} setStage={setCurrentStage} />
      </Container>
    </>
  );
}

export default AppBody;
