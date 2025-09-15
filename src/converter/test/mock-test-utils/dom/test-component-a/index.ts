// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, createWrapper } from '@cloudscape-design/test-utils-core/dom';

export default class TestComponentAWrapper extends ComponentWrapper {
  static rootSelector = 'awsui_button_1ueyk_1xee3_5';
  static legacyRootSelector = 'awsui_button_2oldf_2oldf_5';

  findChild() {
    return createWrapper().find('.test-component-a-child');
  }
}
