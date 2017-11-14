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

import { observer } from 'mobx-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Card } from 'semantic-ui-react';
import { Page } from '@parity/ui';

import DappCard from './DappCard';

import Store from './store';

@observer
export default class SelectMethods extends Component {
  static contextTypes = {
    api: PropTypes.object.isRequired
  };

  store = new Store(this.context.api);

  render () {
    return (
      <Page
        title={
          <FormattedMessage
            id='dapps.methods.label'
            defaultMessage='allowed methods'
          />
        }
      >
        <Card.Group itemsPerRow={ 5 } stackable>
          {this.store.apps.map((dapp, index) => (
            <DappCard
              key={ index }
              dapp={ dapp }
              permissions={ this.store.methods.filter(method =>
                this.store.hasAppPermission(method, dapp.id)
              ) }
            />
          ))}
        </Card.Group>
        {/* <table>
          <thead>
            <tr>
              <th>&nbsp;</th>
              {this.store.methods.map((method, methodIndex) => (
                <th key={ methodIndex }>
                  <div>
                    <span>{method}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {this.store.apps.map(({ id, name }, dappIndex) => (
              <tr key={ dappIndex }>
                <td>{name}</td>
                {this.store.methods.map((method, methodIndex) => (
                  <td
                    className={ styles.check }
                    key={ `${dappIndex}_${methodIndex}` }
                  >
                    <MethodCheck
                      checked={ this.store.hasAppPermission(method, id) }
                      dappId={ id }
                      method={ method }
                      onToggle={ this.store.toggleAppPermission }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table> */}
      </Page>
    );
  }
}
