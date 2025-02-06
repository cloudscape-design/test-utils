// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* eslint-env browser */

import { ComponentWrapper, ElementWrapper, usesDom } from '../../../../../lib/core/dom';

export default class DummyWrapper extends ComponentWrapper<HTMLButtonElement> {
  findOptionalElement(): ElementWrapper<HTMLButtonElement> | null {
    return this.find<HTMLButtonElement>('.awsui-optional-element');
  }

  findRequiredElement(): ElementWrapper<HTMLButtonElement> {
    return this.find<HTMLButtonElement>('.awsui-required-element')!;
  }

  @usesDom
  makeChange(): void {
    this.getElement().click();
  }
}
