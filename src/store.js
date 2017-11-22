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

import { action, extendObservable } from 'mobx';

export const getPermissionId = (method, appId) => `${method}:${appId}`;

export default class Store {
  constructor(api) {
    this._api = api;

    // Using mobx without @observable decorators
    extendObservable(this, {
      apps: [],
      methodGroups: {},
      permissions: {}
    });

    this.loadInitialise();
  }

  setApps = action(apps => {
    this.apps = apps;
  });

  setMethodGroups = action(methodGroups => {
    this.methodGroups = methodGroups;
  });

  setPermissions = action(permissions => {
    this.permissions = permissions;
  });

  toggleAppPermission = action((method, appId) => {
    const id = getPermissionId(method, appId);

    this.permissions = {
      ...this.permissions,
      [id]: !this.permissions[id]
    };

    this.savePermissions();
  });

  hasAppPermission = (method, appId) => {
    return !!this.permissions[getPermissionId(method, appId)];
  };

  loadInitialise = () => {
    return Promise.all([
      this._api.shell.getApps(false),
      this._api.shell.getMethodGroups(),
      this._api.shell.getMethodPermissions()
    ]).then(([apps, methodGroups, permissions]) => {
      this.setApps(apps);
      this.setMethodGroups(methodGroups);
      this.setPermissions(permissions);
    });
  };

  savePermissions = () => {
    this._api.shell.setMethodPermissions(this.permissions);
  };
}
