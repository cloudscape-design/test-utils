// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, createWrapper } from '@cloudscape-design/test-utils-core/dom';

export default class TestComponentBWrapper extends ComponentWrapper {
  static rootSelector = 'test-component-b-root';

  findChild() {
    return createWrapper().find('.test-component-b-child');
  }
}
