import React from 'react';
import { Container, Title } from './styled';
import Menu from '../../components/Menu';

function AppHeader({ user }: { user: string | null }) {
  return (
    <Container>
      <Title>Hacking Materials</Title>
      <Menu user={user} />
    </Container>
  );
}

export default AppHeader;
