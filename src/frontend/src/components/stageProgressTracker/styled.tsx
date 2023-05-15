import styled from 'styled-components';

export const Container = styled.ol`
  margin: 0;
  padding: 0;
  overflow: hidden;
  min-width: 600px;
  box-shadow: var(--shadow);
  clip-path: inset(0px 0px -10px 0px); // make shadow on the bottom only
`;

export const StageItem = styled.li<{ active: boolean }>`
  list-style-type: none;
  display: inline-block;
  width: 33%;

  position: relative;
  margin: 0;
  padding: 0;

  color: ${(props) => (props.active ? 'var(--accent)' : 'var(--text-primary)')};
  font-weight: 600;
  text-align: center;
  line-height: 40px;
  height: 40px;

  background-color: var(--background);

  span {
    cursor: pointer;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  span:after,
  span:before {
    content: '';
    display: block;
    width: 0px;
    height: 0px;

    position: absolute;
    top: 0;
    left: 0;

    border: solid transparent;
    border-left-color: var(--background);
    border-width: 20px;
  }

  span:after {
    top: -5px;
    z-index: 1;
    border-left-color: var(--accent);
    border-width: 25px;
  }

  span:before {
    z-index: 2;
  }

  &:first-child {
    span:after,
    span:before {
      display: none;
    }
  }
`;
