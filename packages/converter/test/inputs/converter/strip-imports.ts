// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';
import { KeyCode } from '@cloudscape-design/test-utils-core/utils';
import ChildWrapper from './simple';

export default class DummyWrapper extends ComponentWrapper {
  findElement(): ChildWrapper {
    return new ChildWrapper(this.find('.awsui-child')!.getElement());
  }

  @usesDom
  findDomElement(): ChildWrapper {
    return new ChildWrapper(this.find('.awsui-child')!.getElement());
  }

  findSomething(): number {
    return KeyCode.enter;
  }
}
