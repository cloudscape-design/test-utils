// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* eslint-env browser */
import { ComponentWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';
import { KeyCode } from '@cloudscape-design/test-utils-core/utils';
import { act } from '@cloudscape-design/test-utils-core/utils-dom';

import ChildWrapper from './simple';

export default class DummyWrapper extends ComponentWrapper {
  findElement(): ChildWrapper {
    return new ChildWrapper(this.find('.awsui-child')!.getElement());
  }

  @usesDom
  findDomElement(): ChildWrapper {
    return new ChildWrapper(this.find('.awsui-child')!.getElement());
  }

  @usesDom
  openDropdown(): void {
    act(() => {
      this.findElement().click();
    });
  }

  findSomething(): number {
    return KeyCode.enter;
  }
}
