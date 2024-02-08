// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../../../../../lib/core/dom';
import ChildWrapper from './simple';

export default class DummyWrapper extends ComponentWrapper {
  findElement(): ElementWrapper | null {
    return this.find('.awsui-element');
  }

  findElements(): Array<ElementWrapper> {
    return this.findAll('.awsui-element');
  }

  findChildren(): Array<ChildWrapper> {
    return this.findAll('.awsui-element').map(element => new ChildWrapper(element.getElement()));
  }
}
