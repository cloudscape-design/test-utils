// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { describe, test, expect } from 'vitest';
import { ElementWrapper, ComponentWrapper } from '../selectors';

// simulate prototype extensions that we generate for our components
declare module '../selectors' {
  interface ElementWrapper {
    findSomething(): void;
  }
}
ElementWrapper.prototype.findSomething = () => {
  /*no-op*/
};

describe('component overrides', () => {
  test('does not have methods defined on ElementWrapper prototype', () => {
    const component = new ComponentWrapper('block');
    const element = new ElementWrapper('element');
    expect(element.findSomething).toEqual(expect.any(Function));
    // @ts-expect-error: we test javascript behavior here which is not a valid typescript
    expect(component.findSomething).toBeUndefined();
  });
});
