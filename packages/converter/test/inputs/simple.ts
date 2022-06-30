// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

export default class DummyWrapper extends ComponentWrapper {
  findElement(): ElementWrapper {
    return this.find('.awsui-element')!;
  }
}
