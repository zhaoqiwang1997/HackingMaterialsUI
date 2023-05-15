import styled from 'styled-components';

export const MenuToggle = styled.div`
  -webkit-user-select: none;
  display: block;
  position: relative;
  right: 30px;
  user-select: none;
  z-index: 1;
`;

export const Trigger = styled.input`
  -webkit-touch-callout: none;
  cursor: pointer;
  display: block;
  height: 32px;
  left: -5px;
  opacity: 0;
  position: absolute;
  top: -7px;
  width: 40px;
  z-index: 2;
`;

export const Link = styled.a<{ $isOpen: boolean }>`
  color: var(--text-primary);
  font-weight: bold;
  height: ${(props) => (props.$isOpen ? '25px' : 0)};
  text-decoration: none;
  transition: color 0.3s ease;
  width: 100%;

  &:hover {
    background-color: #f0f0f0;
    cursor: pointer;
  }
`;

export const Stripe = styled.span<{ $isOpen: boolean }>`
  background: var(--text-primary);
  border-radius: 3px;
  display: block;
  height: 4px;
  margin-bottom: 5px;
  opacity: 1;
  position: relative;
  width: 33px;
  transform-origin: 4px 0px;
  transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1),
    background 0.5s cubic-bezier(0.77, 0.2, 0.05, 1), opacity 0.55s ease;
  z-index: 1;

  &:first-child {
    transform-origin: 0% 0%;
  }

  &:nth-last-child(2) {
    transform-origin: 0% 100%;
  }
`;

export const MainMenu = styled.ul<{ $isOpen: boolean }>`
  -webkit-font-smoothing: antialiased;
  align-items: flex-start;
  background-color: white;
  border-radius: 2px;
  border: ${(props) =>
    props.$isOpen ? '1px solid 	var(--text-primary)' : 'none'};
  display: flex;
  flex-direction: column;
  list-style-type: none;
  padding: 0;
  position: absolute;
  top: 6px;
  right: 13px;
  transform-origin: top right;
  transform: ${(props) => (props.$isOpen ? 'scale(2)' : '')};
  transition: transform 0.2s cubic-bezier(0.41, 0.49, 0.99, 1.04);
`;

export const MenuItem = styled.li<{ $isOpen?: boolean }>`\
  display: ${(props) => (props.$isOpen ? 'inline-block' : 'none')};
  font-size: 0.45rem;
  margin: 0 0.4rem 0.2rem 0.4rem;
  white-space: nowrap;
`;

export const DivisionLine = styled.div<{ $isOpen: boolean }>`
  border-bottom: ${(props) =>
    props.$isOpen ? '1px solid var(--text-primary)' : 'none'};
  width: 100%;
`;

export const Heading = styled.h3<{ $isOpen: boolean }>`
  color: var(--text-primary);
  display: ${(props) => (props.$isOpen ? 'inline-block' : 'none')};
  font-size: 0.45rem;
  margin: 10px 0.4rem 10px 0.4rem;
  vertical-align: center;
  white-space: nowrap;
`;
