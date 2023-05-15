import React, { useEffect } from 'react';
import AppHeader from '../../sections/appHeader';
import AppBody from '../../sections/appBody';
import LoginModal from '../../components/LoginModal';
import useModal from '../../hooks/useModal';
import { WorkflowOutputProvider } from '../../utils/WorkflowOutputsContext';
import { useNavigate } from 'react-router-dom';

function Homepage() {
  const { isShowing, toggle } = useModal();
  const navigate = useNavigate();
  const user = sessionStorage.getItem('user');

  useEffect(() => {
    if (!user) navigate('/');
  }, [user]);

  return (
    <WorkflowOutputProvider>
      <LoginModal isShowing={isShowing} hide={toggle} />
      <AppHeader user={user} />
      <AppBody />
    </WorkflowOutputProvider>
  );
}

export default Homepage;
