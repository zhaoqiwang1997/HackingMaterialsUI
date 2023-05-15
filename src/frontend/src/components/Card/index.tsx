import React from 'react';
import { Container, Title } from './styled';

function Card({
  children,
  title,
  ...props
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <Container {...props}>
      <Title>{title}</Title>
      {children}
    </Container>
  );
}

export default Card;
