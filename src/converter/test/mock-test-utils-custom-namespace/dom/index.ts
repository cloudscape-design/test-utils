
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper } from '@my-lib/test-utils-core/dom';
import { appendSelector } from '@cloudscape-design/test-utils-core/utils';

export { ElementWrapper };

import TestComponentAWrapper from './test-component-a';
import TestComponentBWrapper from './test-component-b';


export { TestComponentAWrapper };
export { TestComponentBWrapper };

declare module '@my-lib/test-utils-core/dist/dom' {
   interface ElementWrapper {
    
/**
 * Returns the wrapper of the first TestComponentA that matches the specified CSS selector.
 * If no CSS selector is specified, returns the wrapper of the first TestComponentA.
 * If no matching TestComponentA is found, returns `null`.
 *
 * @param {string} [selector] CSS Selector
 * @returns {TestComponentAWrapper | null}
 */
findTestComponentA(selector?: string): TestComponentAWrapper | null;

/**
 * Returns an array of TestComponentA wrapper that matches the specified CSS selector.
 * If no CSS selector is specified, returns all of the TestComponentAs inside the current wrapper.
 * If no matching TestComponentA is found, returns an empty array.
 *
 * @param {string} [selector] CSS Selector
 * @returns {Array<TestComponentAWrapper>}
 */
findAllTestComponentAs(selector?: string): Array<TestComponentAWrapper>;

/**
 * Returns the wrapper of the closest parent TestComponentA for the current element,
 * or the element itself if it is an instance of TestComponentA.
 * If no TestComponentA is found, returns `null`.
 *
 * @returns {TestComponentAWrapper | null}
 */
findClosestTestComponentA(): TestComponentAWrapper | null;
/**
 * Returns the wrapper of the first TestComponentB that matches the specified CSS selector.
 * If no CSS selector is specified, returns the wrapper of the first TestComponentB.
 * If no matching TestComponentB is found, returns `null`.
 *
 * @param {string} [selector] CSS Selector
 * @returns {TestComponentBWrapper | null}
 */
findTestComponentB(selector?: string): TestComponentBWrapper | null;

/**
 * Returns an array of TestComponentB wrapper that matches the specified CSS selector.
 * If no CSS selector is specified, returns all of the TestComponentBs inside the current wrapper.
 * If no matching TestComponentB is found, returns an empty array.
 *
 * @param {string} [selector] CSS Selector
 * @returns {Array<TestComponentBWrapper>}
 */
findAllTestComponentBs(selector?: string): Array<TestComponentBWrapper>;

/**
 * Returns the wrapper of the closest parent TestComponentB for the current element,
 * or the element itself if it is an instance of TestComponentB.
 * If no TestComponentB is found, returns `null`.
 *
 * @returns {TestComponentBWrapper | null}
 */
findClosestTestComponentB(): TestComponentBWrapper | null;
   }
}


ElementWrapper.prototype.findTestComponentA = function(selector) {
  let rootSelector = `.${TestComponentAWrapper.rootSelector}`;
  if("legacyRootSelector" in TestComponentAWrapper && TestComponentAWrapper.legacyRootSelector){
    rootSelector = `:is(.${TestComponentAWrapper.rootSelector}, .${TestComponentAWrapper.legacyRootSelector})`;
  }
  // casting to 'any' is needed to avoid this issue with generics
  // https://github.com/microsoft/TypeScript/issues/29132
  return (this as any).findComponent(selector ? appendSelector(selector, rootSelector) : rootSelector, TestComponentAWrapper);
};

ElementWrapper.prototype.findAllTestComponentAs = function(selector) {
  return this.findAllComponents(TestComponentAWrapper, selector);
};
ElementWrapper.prototype.findTestComponentB = function(selector) {
  let rootSelector = `.${TestComponentBWrapper.rootSelector}`;
  if("legacyRootSelector" in TestComponentBWrapper && TestComponentBWrapper.legacyRootSelector){
    rootSelector = `:is(.${TestComponentBWrapper.rootSelector}, .${TestComponentBWrapper.legacyRootSelector})`;
  }
  // casting to 'any' is needed to avoid this issue with generics
  // https://github.com/microsoft/TypeScript/issues/29132
  return (this as any).findComponent(selector ? appendSelector(selector, rootSelector) : rootSelector, TestComponentBWrapper);
};

ElementWrapper.prototype.findAllTestComponentBs = function(selector) {
  return this.findAllComponents(TestComponentBWrapper, selector);
};

ElementWrapper.prototype.findClosestTestComponentA = function() {
  // casting to 'any' is needed to avoid this issue with generics
  // https://github.com/microsoft/TypeScript/issues/29132
  return (this as any).findClosestComponent(TestComponentAWrapper);
};
ElementWrapper.prototype.findClosestTestComponentB = function() {
  // casting to 'any' is needed to avoid this issue with generics
  // https://github.com/microsoft/TypeScript/issues/29132
  return (this as any).findClosestComponent(TestComponentBWrapper);
};

export default function wrapper(root: Element = document.body) {
  if (document && document.body && !document.body.contains(root)) {
    console.warn('[AwsUi] [test-utils] provided element is not part of the document body, interactions may work incorrectly')
  };
  return new ElementWrapper(root);
}
