import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import styled from 'styled-components';
import TextWorkflowOutput from './index';

const Container = styled.div`
  width: 100%;
  text-align: center;
`;

export default {
  title: 'Reusable Components/TextWorkflowOutput',
  component: TextWorkflowOutput,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof TextWorkflowOutput>;

const Template: ComponentStory<typeof TextWorkflowOutput> = (args) => (
  <Container>
    <TextWorkflowOutput {...args} />
  </Container>
);

export const Standard = Template.bind({});
Standard.args = {
  children: 'This is a standard output message.',
};

export const Success = Template.bind({});
Success.args = {
  type: 'success',
  children: 'This is a success output message.',
};

export const Error = Template.bind({});
Error.args = {
  type: 'error',
  children: 'This is a error output message.',
};

export const Warning = Template.bind({});
Warning.args = {
  type: 'warning',
  children: 'This is a warning output message.',
};
