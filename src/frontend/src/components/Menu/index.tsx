import React, { useState } from 'react';
import {
  DivisionLine,
  MenuToggle,
  Heading,
  Trigger,
  Link,
  Stripe,
  MainMenu,
  MenuItem,
} from './styled';
import Logout from '../../components/Logout';
import MsalLogout from '../MsalLogout';

const MENU_ITEMS: string[] = ['Export Model', 'Export Workflow'];

const Menu = ({ user }: { user: string | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const userObject = user ? JSON.parse(user) : {};

  const handleClick = () => {
    alert('clicked!');
    // TODO: Once backend endpoint is ready, raise event to GET get the selected service.
    // TODO2: Workout which selections will be available for the Regular User / Pro User.
  };

  return (
    <MenuToggle>
      <Trigger type="checkbox" onClick={() => setIsOpen(!isOpen)} />
      <Stripe $isOpen={isOpen} />
      <Stripe $isOpen={isOpen} />
      <Stripe $isOpen={isOpen} />
      <MainMenu $isOpen={isOpen}>
        <Heading $isOpen={isOpen}>Make a Selection</Heading>
        <DivisionLine $isOpen={isOpen} />
        {MENU_ITEMS.map((description) => (
          <Link
            id={description}
            key={description}
            $isOpen={isOpen}
            onClick={handleClick}
          >
            <MenuItem $isOpen={isOpen}>{description}</MenuItem>
          </Link>
        ))}
        {isOpen && userObject?.authProvider === 'Google' && <Logout />}
        {isOpen && userObject?.authProvider === 'Msal' && <MsalLogout />}
      </MainMenu>
    </MenuToggle>
  );
};

export default Menu;
