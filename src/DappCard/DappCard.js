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

import React, { PureComponent } from 'react';
import { Card, Image, List } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';

import styles from './DappCard.css';
import Store from '../store';

@observer
export default class DappCard extends PureComponent {
  static propTypes = {};

  state = {
    active: false
  };

  handleMakeActive = active => this.setState({ active: true });

  handleMakeInctive = active => this.setState({ active: false });

  render () {
    const { dapp, permissions } = this.props;

    return (
      <Card
        link
        color={ this.state.active ? 'blue' : null }
        onMouseEnter={ this.handleMakeActive }
        onMouseLeave={ this.handleMakeInctive }
      >
        <Card.Content>
          <Image src={ dapp.image } className={ styles.icon } centered />
          <Card.Header>{dapp.name}</Card.Header>
          <Card.Meta>{dapp.description}</Card.Meta>
          <Card.Description>
            <FormattedMessage
              id='dapps.methods.allowedMethods'
              defaultMessage='Allowed Methods'
            />:
            {permissions.length ? (
              <List bulleted>
                {permissions.map((method, methodIndex) => (
                  <List.Item key={ methodIndex }>{method}</List.Item>
                ))}
              </List>
            ) : (
              <p>
                <FormattedMessage
                  id='dapps.methods.none'
                  defaultMessage='None'
                />
              </p>
            )}
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}
