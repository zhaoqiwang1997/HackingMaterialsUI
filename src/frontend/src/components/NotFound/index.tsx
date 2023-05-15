import React from 'react';
import { Container, Message, SubTitle, Title } from './styled';

function NotFound() {
  return (
    <Container>
      <Title>404</Title>
      <SubTitle>Not Found</SubTitle>
      <Message>The requested resource could not be found.</Message>
    </Container>
  );
}

export default NotFound;
