import React, { useEffect } from 'react';
import {
  BottomSection,
  Container,
  HBox,
  MainHeading,
  SubHeading,
  UpperSection,
  VBox,
} from './styled';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { useMsal } from '@azure/msal-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const backendURI = process.env.REACT_APP_BACKEND_API_URI;

function LandingPage({ toggle }: { toggle: () => void }) {
  const navigate = useNavigate();
  const { instance } = useMsal();

  useEffect(() => {
    instance.handleRedirectPromise().then((tokenResponse) => {
      if (tokenResponse === null) return;
      return fetch(backendURI + '/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token_id: tokenResponse.idToken,
          pro_user: JSON.parse(sessionStorage.getItem('proSelection') || '')
            .proSelection,
          auth_provider: 'Msal',
        }),
      })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.error) {
            return toast.error(responseData.error);
          }

          const Object = {
            ...responseData,
            authProvider: 'Msal',
          };
          sessionStorage.setItem('user', JSON.stringify(Object));
        })
        .then(() => navigate('/workflow'))
        .catch(() =>
          toast.error(
            'Sign-in error. Please make sure to use an unimelb.edu.au email or try again later.',
          ),
        );
    });
  }, []);

  return (
    <Container>
      <UpperSection>
        <VBox>
          <MainHeading>
            Hacking Materials: A user friendly tool for data mining the
            properties of materials
          </MainHeading>
          <Button
            label="Start Exploring"
            onClick={toggle}
            primary={true}
            style={{
              backgroundColor: '#555555',
              border: 0,
              color: 'var(--ui)',
              fontSize: '1rem',
              fontWeight: 'bold',
              padding: '1rem',
              width: 200,
            }}
          />
        </VBox>
      </UpperSection>
      <BottomSection>
        <SubHeading>Features Introduction</SubHeading>
        <HBox>
          <Card>
            <h2>Data Retrieval</h2>
            <p>
              Retrieve data from the biggest materials databases, such as the
              Materials Project and Citrine’s databases.
            </p>
          </Card>
          <Card>
            <h2>Featurizers</h2>
            <p>
              Transform materials objects raw data into processed form, which is
              suitable for machine learning with ease.
            </p>
          </Card>
          <Card>
            <h2>Plotting</h2>
            <p>
              Use different types of plots to display two or more properties and
              compare the ratio between them.
            </p>
          </Card>
        </HBox>
        <p>&copy; 2022 - Hacking Materials Team</p>
      </BottomSection>
    </Container>
  );
}

export default LandingPage;
