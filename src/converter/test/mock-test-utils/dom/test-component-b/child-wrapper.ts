// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, createWrapper } from '@cloudscape-design/test-utils-core/dom';

export class ChildWrapper extends ComponentWrapper {
  static rootSelector = 'test-component-b-child';

  findContent() {
    return createWrapper().find('.test-component-b-child-content');
  }
}
