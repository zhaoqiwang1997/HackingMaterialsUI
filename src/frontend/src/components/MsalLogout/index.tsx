import React from 'react';
import { useMsal } from '@azure/msal-react';
import { LinkButton } from '../Logout/styled';

function MsalLogout() {
  const { instance } = useMsal();

  const handleLogout = (logoutType: string) => {
    if (logoutType === 'popout') {
      sessionStorage.removeItem('user');
      instance.logoutRedirect({
        postLogoutRedirectUri: '/',
      });
    }
  };

  return <LinkButton onClick={() => handleLogout('popout')}>Logout</LinkButton>;
}

export default MsalLogout;
