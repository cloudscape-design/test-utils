// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, createWrapper } from '@cloudscape-design/test-utils-core/dom';

export default class TestComponentAWrapper extends ComponentWrapper {
  static rootSelector = 'test-component-a-root';

  findChild() {
    return createWrapper().find('.test-component-a-child');
  }
}
