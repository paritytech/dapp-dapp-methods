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

import { toJS } from 'mobx';
import Store from '../store';

const mock = {
  apps: [
    { id: '123', name: '123' },
    { id: '456', name: '456' },
    { id: '789', name: '789' }
  ],
  methodGroups: { shell: { method: ['foo', 'bar'] } },
  permissions: { 'foo:123': true },
  api: {
    shell: {
      getApps: () => Promise.resolve(),
      getMethodGroups: () => Promise.resolve(),
      getMethodPermissions: () => Promise.resolve(),
      setMethodPermissions: () => {}
    }
  }
};

test('should correctly loadInitialise', () => {
  const store = new Store({
    shell: {
      ...mock.api.shell,
      getApps: () => Promise.resolve(mock.apps),
      getMethodGroups: () => Promise.resolve(mock.methodGroups),
      getMethodPermissions: () => Promise.resolve(mock.permissions)
    }
  });
  expect.assertions(5);
  return store.loadInitialise().then(() => {
    expect(store.apps).toContainEqual(mock.apps[0]);
    expect(store.apps).toContainEqual(mock.apps[1]);
    expect(store.apps).toContainEqual(mock.apps[2]);
    expect(toJS(store.methodGroups)).toEqual(mock.methodGroups);
    expect(toJS(store.permissions)).toEqual(mock.permissions);
  });
});

test('should handle setApps', () => {
  const store = new Store(mock.api);
  store.setApps(mock.apps);

  expect(store.apps).toHaveLength(3);
});

test('should handle setMethodGroups', () => {
  const store = new Store(mock.api);
  store.setMethodGroups(mock.methodGroups);

  expect(toJS(store.methodGroups)).toEqual(mock.methodGroups);
});

test('should handle setPermissions', () => {
  const store = new Store(mock.api);
  store.setPermissions(mock.permissions);

  expect(toJS(store.permissions)).toEqual(mock.permissions);
});

test('should handle hasAppPermission', () => {
  const store = new Store(mock.api);
  store.setPermissions(mock.permissions);

  expect(store.hasAppPermission('foo', '123')).toBe(true);
});

test('should handle toggleAppPermission and call setMethodPermissions', () => {
  const setMethodPermissions = jest.fn();
  const store = new Store({
    shell: { ...mock.api.shell, setMethodPermissions }
  });
  store.setPermissions(mock.permissions);
  store.toggleAppPermission('foo', '123');

  expect(toJS(store.permissions)).toEqual({ 'foo:123': false });
  expect(setMethodPermissions).toHaveBeenCalledWith({ 'foo:123': false });
});
