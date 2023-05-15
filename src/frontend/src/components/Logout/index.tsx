import React from 'react';
import { GoogleLogout } from 'react-google-login';
import { LinkButton } from './styled';

let clientId = '';
if (process.env.REACT_APP_GOOGLE_CLIENT_ID)
  clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function Logout() {
  const logout = () => {
    window.location.reload();
    sessionStorage.removeItem('user');
  };

  return (
    <>
      <GoogleLogout
        clientId={clientId}
        render={(renderProps) => (
          <LinkButton
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
          >
            Logout
          </LinkButton>
        )}
        buttonText="Logout"
        onLogoutSuccess={logout}
        style={{ display: 'none' }}
      />
    </>
  );
}

export default Logout;
