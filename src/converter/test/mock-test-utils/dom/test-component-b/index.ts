// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, createWrapper } from '@cloudscape-design/test-utils-core/dom';
import { ChildWrapper } from './child-wrapper';

export default class TestComponentBWrapper extends ComponentWrapper {
  static rootSelector = 'test-component-b-root';

  findChild(): ChildWrapper {
    return createWrapper().find(`.${ChildWrapper.rootSelector}`);
  }
}
