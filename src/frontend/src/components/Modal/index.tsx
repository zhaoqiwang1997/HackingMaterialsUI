import React from 'react';
import ReactDOM from 'react-dom';
import { CloseBtn, Container, Content, Header, Overlay } from './styled';

function Modal({
  children,
  containerStyle,
  isShowing,
  hide,
}: {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/ban-types
  containerStyle?: {};
  isShowing: boolean;
  hide: () => void;
}) {
  return isShowing
    ? ReactDOM.createPortal(
        <React.Fragment>
          <Overlay>
            <Container style={containerStyle}>
              <Header>
                <CloseBtn
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={hide}
                >
                  <span aria-hidden="true">&times;</span>
                </CloseBtn>
              </Header>
              <Content>{children}</Content>
            </Container>
          </Overlay>
        </React.Fragment>,
        document.body,
      )
    : null;
}

export default Modal;
