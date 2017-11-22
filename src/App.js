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

import Card from 'semantic-ui-react/dist/commonjs/views/Card';
import ActionBar from '@parity/ui/lib/Actionbar/actionbar';

import DappCard from './DappCard';
import styles from './App.css';

class App extends Component {
  state = {
    selectedDapp: null
  };

  handleSelectDapp = id => {
    if (this.state.selectedDapp === id) {
      this.setState({ selectedDapp: null });
    } else {
      this.setState({ selectedDapp: id });
    }
  };

  render() {
    const { store } = this.props;
    return (
      <div className={styles.layout}>
        <ActionBar
          title={
            <FormattedMessage
              id="dapps.methods.title"
              defaultMessage="Allowed methods"
            />
          }
        />
        <Card.Group stackable className={styles.cardGroup}>
          {store.apps.map(dapp => (
            <DappCard
              key={dapp.id}
              editingMode={dapp.id === this.state.selectedDapp}
              dapp={dapp}
              methodGroups={store.methodGroups}
              permissions={store.permissions}
              onEdit={() => this.handleSelectDapp(dapp.id)}
              onToggle={store.toggleAppPermission}
            />
          ))}
        </Card.Group>
      </div>
    );
  }
}

export default observer(App);

App.propTypes = {
  store: PropTypes.object.isRequired
};
