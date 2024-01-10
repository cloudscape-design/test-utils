// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/selectors';
import styles from '../../../alert/styles.selectors.js';
import ButtonWrapper from '../button';

export default class AlertWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  findRootElement(): ElementWrapper {
    return this.findByClassName(styles.alert)!;
  }

  findDismissButton(): ComponentWrapper {
    return this.findComponent(`.${styles[`dismiss-button`]}`, ButtonWrapper);
  }

  findActionButton(): ComponentWrapper {
    const styleVariable = 'button';
    return this.findComponent(`.${styles[`action-${styleVariable}`]}`, ButtonWrapper);
  }

  findHeader(): ElementWrapper {
    return this.findByClassName(styles.header);
  }

  findContent(): ElementWrapper {
    return this.findByClassName(styles.content)!;
  }

  findActionSlot(): ElementWrapper {
    return this.findByClassName(styles['action-slot']);
  }
}
