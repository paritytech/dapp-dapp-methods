// Copyright 2015-2017 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react';
import { shallowToJson } from 'enzyme-to-json';

import { shallowWithIntl } from '../setupTests';
import App from '../App';
import DappCard from '../DappCard';

const props = {
  store: {
    apps: [{ id: '123', name: '123' }, { id: '456', name: '456' }],
    methodGroups: { shell: { methods: ['foo', 'bar'] } },
    permissions: { 'foo:123': true },
    toggleAppPermission: () => {}
  }
};

test('should render correctly', () => {
  const component = shallowWithIntl(<App {...props} />);

  expect(shallowToJson(component)).toMatchSnapshot();
});

test('should select a dapp when we click on its edit button', () => {
  const component = shallowWithIntl(<App {...props} />);

  component
    .find(DappCard)
    .last()
    .props()
    .onEdit();

  expect(component.state().selectedDapp).toEqual('456');
});

test('should render correctly when a dapp is selected', () => {
  const component = shallowWithIntl(<App {...props} />);
  component.setState({ selectedDapp: '456' });

  expect(shallowToJson(component)).toMatchSnapshot();
});

test('should deselect a dapp when we click again on its edit button', () => {
  const component = shallowWithIntl(<App {...props} />);
  component.setState({ selectedDapp: '456' });

  component
    .find(DappCard)
    .last()
    .props()
    .onEdit();

  expect(component.state().selectedDapp).toEqual(null);
});

test('should call onToggleAppPermission when we toggle permission', () => {
  const toggleAppPermission = jest.fn();
  const component = shallowWithIntl(
    <App store={{ ...props.store, toggleAppPermission }} />
  );

  component
    .find(DappCard)
    .last()
    .props()
    .onToggle();

  expect(toggleAppPermission).toHaveBeenCalled();
});
