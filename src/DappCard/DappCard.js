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
import { toJS } from 'mobx';
import { Accordion, Button, Card, Image, List } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import flatten from 'lodash/flatten';

import { getPermissionId } from '../store';
import styles from './DappCard.css';

class DappCard extends PureComponent {
  static propTypes = {
    dapp: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string
    }).isRequired,
    editingMode: PropTypes.bool,
    methodGroups: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
    onToggle: PropTypes.func.isRequired,
    permissions: PropTypes.object.isRequired
  };

  renderEditingMode = () => {
    const { dapp, methodGroups, permissions, onToggle } = this.props;

    const panels = Object.keys(methodGroups).map(group => ({
      title: {
        key: `${dapp.id}-${group}-editing-title`,
        active: true,
        content: <FormattedMessage {...messages[group]} />
      },
      content: {
        key: `${dapp.id}-${group}-editing-content`,
        active: true,
        content: (
          <List className={styles.editList}>
            {methodGroups[group].methods.map(method => (
              <List.Item
                key={method}
                onClick={() => onToggle(method, dapp.id)}
                className={styles.editListItem}
              >
                <List.Icon
                  name={
                    permissions[getPermissionId(method, dapp.id)]
                      ? 'checkmark box'
                      : 'square outline'
                  }
                />
                {method}
              </List.Item>
            ))}
          </List>
        )
      }
    }));

    return <Accordion panels={panels} />;
  };

  renderViewMode = () => {
    const { methodGroups, permissions, dapp } = this.props;

    if (
      !methodGroups ||
      !flatten(
        Object.values(toJS(methodGroups)).map(({ methods }) => methods)
      ).some(method => permissions[getPermissionId(method, dapp.id)])
    ) {
      return (
        <div className={styles.noAllowedMethods}>
          <FormattedMessage
            id="dapps.methods.noAllowedMethods"
            defaultMessage="No allowed methods"
          />
        </div>
      );
    }

    const panels = Object.keys(methodGroups)
      .filter(group =>
        methodGroups[group].methods.some(
          method => permissions[getPermissionId(method, dapp.id)]
        )
      )
      .map(group => ({
        title: {
          key: `${dapp.id}-${group}-title`,
          content: <FormattedMessage {...messages[group]} />
        },
        content: {
          key: `${dapp.id}-${group}-content`,
          content: (
            <List bulleted className={styles.list}>
              {methodGroups[group].methods.map(
                method =>
                  permissions[getPermissionId(method, dapp.id)] && (
                    <List.Item key={method}>{method}</List.Item>
                  )
              )}
            </List>
          )
        }
      }));

    return <Accordion panels={panels} />;
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
            {editingMode ? this.renderEditingMode() : this.renderViewMode()}
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}

export default DappCard;

const messages = {
  shell: {
    id: 'dapp.methods.shell',
    description: 'Explanation of the shell methodGroup permission',
    defaultMessage: 'Can get access to the Shell'
  },
  accountsView: {
    id: 'dapp.methods.accountsView',
    description: 'Explanation of the accountsView methodGroup permission',
    defaultMessage: 'Can view your Parity accounts'
  },
  accountsCreate: {
    id: 'dapp.methods.accountsCreate',
    description: 'Explanation of the accountsCreate methodGroup permission',
    defaultMessage: 'Can create new Parity accounts'
  },
  accountsEdit: {
    id: 'dapp.methods.accountsEdit',
    description: 'Explanation of the accountsEdit methodGroup permission',
    defaultMessage: 'Can edit your Parity accounts'
  },
  upgrade: {
    id: 'dapp.methods.upgrade',
    description: 'Explanation of the upgrade methodGroup permission',
    defaultMessage: 'Can upgrade Parity'
  },
  vaults: {
    id: 'dapp.methods.vaults',
    description: 'Explanation of the vaults methodGroup permission',
    defaultMessage: 'Can get access to your vaults'
  },
  other: {
    id: 'dapp.methods.other',
    description: 'Explanation of the other methodGroup permission',
    defaultMessage: 'Other permissions'
  }
};
