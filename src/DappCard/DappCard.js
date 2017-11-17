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
import PropTypes from 'prop-types';
import { Button, Card, Image, List } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

import { CheckboxTickedIcon, CheckboxUntickedIcon } from '@parity/ui/lib/Icons';
import { arrayOrObjectProptype } from '@parity/shared/lib/util/proptypes';
import styles from './DappCard.css';

export default class DappCard extends PureComponent {
  static propTypes = {
    allowed: PropTypes.array.isRequired,
    dapp: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string
    }).isRequired,
    editingMode: PropTypes.bool,
    methods: arrayOrObjectProptype().isRequired,
    onEdit: PropTypes.func.isRequired,
    onToggle: PropTypes.func.isRequired
  };

  renderEditingMode = () => {
    const { dapp, methods, allowed, onToggle } = this.props;

    // Create a map of allowed methods for faster access
    const allowedMap = {};

    allowed.forEach(permission => (allowedMap[permission] = true));

    return (
      <List>
        {methods.map((method, methodIndex) => (
          <List.Item
            className={styles.item}
            key={methodIndex}
            onClick={() => onToggle(method, dapp.id)}
          >
            <List.Icon>
              {allowedMap[method] ? (
                <CheckboxTickedIcon />
              ) : (
                <CheckboxUntickedIcon />
              )}
            </List.Icon>
            {method}
          </List.Item>
        ))}
      </List>
    );
  };

  renderViewMode = () => {
    const { allowed } = this.props;

    return (
      <List bulleted className={styles.compactList}>
        {allowed.length ? (
          allowed.map((method, methodIndex) => (
            <List.Item className={styles.item} key={methodIndex}>
              {method}
            </List.Item>
          ))
        ) : (
          <List.Item>
            <FormattedMessage id="dapps.methods.none" defaultMessage="None" />
          </List.Item>
        )}
      </List>
    );
  };

  render() {
    const { dapp, editingMode, onEdit } = this.props;

    return (
      <Card>
        <Card.Content>
          <Button
            floated="right"
            basic
            size="mini"
            icon={editingMode ? 'remove' : 'edit'}
            className={styles.editButton}
            onClick={onEdit}
          />
          <Image src={dapp.image} className={styles.picture} centered />
          <Card.Header>{dapp.name}</Card.Header>
          <Card.Meta>{dapp.description}</Card.Meta>
          <Card.Description>
            <FormattedMessage
              id="dapps.methods.allowedMethods"
              defaultMessage="Allowed Methods"
            />:
            {editingMode ? this.renderEditingMode() : this.renderViewMode()}
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}
