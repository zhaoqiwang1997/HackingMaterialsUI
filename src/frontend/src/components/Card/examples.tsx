import React from 'react';
import Card from './index';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import penguinImg from '../../../public/penguin.png';

export default {
  title: 'Reusable Components/Card',
  component: Card,
} as ComponentMeta<typeof Card>;

const Template: ComponentStory<typeof Card> = (args) => <Card {...args} />;

export const withTitle = Template.bind({});
withTitle.args = {
  title: `Title`,
  children: (
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae,
      consequuntur?
    </p>
  ),
};

export const noTitle = Template.bind({});
noTitle.args = {
  children: (
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, nulla?
    </p>
  ),
};

export const longText = Template.bind({});
longText.args = {
  children: (
    <p>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Earum sit
      assumenda voluptas! Optio rerum est sapiente. Nulla nemo labore facilis
      veniam ab illo repellendus, exercitationem ut esse eius optio vel eveniet
      beatae cum eaque enim corporis, iste minus ratione quasi minima? Quidem
      quia laudantium omnis fuga! Excepturi suscipit voluptatum voluptatem?
    </p>
  ),
};

export const withImage = Template.bind({});
withImage.args = {
  title: `Yes, I' am a penguin.`,
  children: (
    <img
      src={penguinImg}
      style={{ height: 150, width: 150 }}
      alt="penguin"
    ></img>
  ),
};
