import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { Button, List } from 'semantic-ui-react';

import DappCard from '../../src/DappCard';

const props = {
  dapp: {
    id: '123',
    name: 'Test'
  },
  allowed: ['bar'],
  methods: ['foo', 'bar'],
  onEdit: () => {},
  onToggle: () => {}
};

test('should render correctly in viewing mode', () => {
  const component = shallow(<DappCard { ...props } />);

  expect(shallowToJson(component)).toMatchSnapshot();
});

test('should render correctly in editing mode', () => {
  const component = shallow(<DappCard { ...props } editingMode />);

  expect(shallowToJson(component)).toMatchSnapshot();
});

test('should handle onEdit button click', () => {
  const onEdit = jest.fn();

  const component = shallow(<DappCard { ...props } onEdit={ onEdit } />);

  component
    .find(Button)
    .last()
    .simulate('click');
  expect(onEdit).toHaveBeenCalled();
});

test('should handle onToggle click', () => {
  const onToggle = jest.fn();

  const component = shallow(
    <DappCard { ...props } editingMode onToggle={ onToggle } />
  );

  component
    .find(List.Item)
    .first() // The 'foo' one
    .simulate('click');
  expect(onToggle).toHaveBeenCalled();
});
