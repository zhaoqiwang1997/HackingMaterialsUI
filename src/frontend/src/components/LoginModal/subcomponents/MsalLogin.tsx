import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from './msalConfig';
import styled from 'styled-components';

const MsalLoginButton = styled.button`
  background-color: rgb(255, 255, 255);
  border-radius: 2px;
  border: 1px solid transparent;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 2px 2px 0px,
    rgba(0, 0, 0, 0.24) 0px 0px 1px 0px;
  color: var(--accent);
  display: inline-flex;
  padding: 10px 10px 10px 30px;
  font-size: 14px;
  font-weight: 500;
  font-family: Roboto, sans-serif;
  height: 43px;
  text-align: center;

  &:hover {
    cursor: pointer;
  }
`;

const MsalLogin = ({ isProSelected }: { isProSelected: boolean }) => {
  const { instance } = useMsal();

  const handleLogin = (loginType: string) => {
    if (loginType === 'redirect') {
      sessionStorage.setItem(
        'proSelection',
        JSON.stringify({ proSelection: isProSelected }),
      );
      instance.loginRedirect(loginRequest).catch((e) => {
        throw new Error(e);
      });
    }
  };
  return (
    <MsalLoginButton onClick={() => handleLogin('redirect')}>
      Sign in with Microsoft
    </MsalLoginButton>
  );
};

export default MsalLogin;
