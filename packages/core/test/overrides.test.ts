// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper, ComponentWrapper } from '../src/selectors';

// simulate prototype extensions that we generate for our components
declare module '../src/selectors' {
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
    // we test javascript behavior here which is not a valid typescript
    // @ts-expect-error
    expect(component.findSomething).toBeUndefined();
  });
});
