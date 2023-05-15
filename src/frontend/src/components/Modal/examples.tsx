import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Modal from './index';

export default {
  title: 'Reusable Components/Modal',
  component: Modal,
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => <Modal {...args} />;

export const defaultSize = Template.bind({});
defaultSize.args = {
  children: `I'am a modal`,
  isShowing: true,
  hide: () => console.log('closed'),
};

export const small = Template.bind({});
small.args = {
  containerStyle: { height: '40vh', width: '40vw' },
  children: `I'am a modal`,
  isShowing: true,
  hide: () => console.log('closed'),
};

export const large = Template.bind({});
large.args = {
  containerStyle: { height: '80vh', width: '60vw' },
  children: `I'am a modal`,
  isShowing: true,
  hide: () => console.log('closed'),
};
