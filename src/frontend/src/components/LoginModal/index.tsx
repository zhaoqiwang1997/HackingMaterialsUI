import React, { useEffect, useState } from 'react';
import { GoogleLogin } from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import { gapi } from 'gapi-script';
import { InputGroup, Text, Title, VBox } from './styled';
import Modal from '../Modal';
import MsalLogin from './subcomponents/MsalLogin';
import { toast } from 'react-toastify';

const backendURI = process.env.REACT_APP_BACKEND_API_URI;
let clientId = '';
if (process.env.REACT_APP_GOOGLE_CLIENT_ID)
  clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function LoginModal({
  isShowing,
  hide,
}: {
  isShowing: boolean;
  hide: () => void;
}) {
  const navigate = useNavigate();
  const [isProSelected, setIsProSelected] = useState(false);

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId,
        scope: '',
      });
    };
    gapi.load('client:auth2', initClient);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSuccess = (res: any) => {
    fetch(backendURI + '/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token_id: res.tokenId,
        pro_user: isProSelected,
        auth_provider: 'google',
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.error) {
          return toast.error(responseData.error);
        }

        const Object = {
          ...responseData,
          authProvider: 'Google',
        };
        sessionStorage.setItem('user', JSON.stringify(Object));
      })
      .then(() => navigate('/workflow'))
      .catch(() =>
        toast.error(
          'Sign-in error. Please make sure to use an unimelb.edu.au email or try again later.',
        ),
      );
    hide();
    navigate('/workflow');
  };

  const onFailure = () => {
    hide();
    navigate('/');
  };
  return (
    <Modal
      containerStyle={{ height: 400, width: 400 }}
      isShowing={isShowing}
      hide={hide}
    >
      <VBox>
        <Title>Sign in</Title>
        <Text>The current version only support unimelb.edu.au emails.</Text>
        <GoogleLogin
          clientId={clientId}
          buttonText="Sign in with Google"
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy="single_host_origin"
          isSignedIn
        />
        <MsalLogin isProSelected={isProSelected} />
        <InputGroup>
          <input
            type="checkbox"
            id="prouser"
            name="prouser"
            checked={isProSelected}
            onChange={(e) => setIsProSelected(e.target.checked)}
          />
          <label htmlFor="prouser">I am a pro user</label>
        </InputGroup>
      </VBox>
    </Modal>
  );
}

export default LoginModal;
