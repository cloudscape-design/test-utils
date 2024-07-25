// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, usesDom } from '../../../../../lib/core/dom';
import { KeyCode } from '../../../../../lib/core/utils';
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
