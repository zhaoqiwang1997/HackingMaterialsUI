import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import GlobalStyle from './GlobalStyle';
import LoginModal from './components/LoginModal';
import NotFound from './components/NotFound';
import Homepage from './pages/homepage';
import LandingPage from './pages/LandingPage';
import useModal from './hooks/useModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { isShowing, toggle } = useModal();
  return (
    <>
      <Router>
        <GlobalStyle />
        <ToastContainer />
        <LoginModal isShowing={isShowing} hide={toggle} />
        <Routes>
          <Route path="/workflow" element={<Homepage />} />
          <Route path="/" element={<LandingPage toggle={toggle} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
