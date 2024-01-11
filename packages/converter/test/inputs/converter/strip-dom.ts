// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* eslint-env browser */
import { Simulate } from 'react-dom/test-utils';
import { ComponentWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';

export default class DummyWrapper extends ComponentWrapper<HTMLButtonElement> {
  findOptionalElement(): ElementWrapper<HTMLButtonElement> | null {
    return this.find<HTMLButtonElement>('.awsui-optional-element');
  }

  findRequiredElement(): ElementWrapper<HTMLButtonElement> {
    return this.find<HTMLButtonElement>('.awsui-required-element')!;
  }

  @usesDom
  makeChange(): void {
    Simulate.change(this.getElement());
  }
}
