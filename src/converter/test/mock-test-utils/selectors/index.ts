
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper } from '@cloudscape-design/test-utils-core/selectors';
import { appendSelector } from '@cloudscape-design/test-utils-core/utils';

export { ElementWrapper };

import TestComponentAWrapper from './test-component-a';
import TestComponentBWrapper from './test-component-b';


export { TestComponentAWrapper };
export { TestComponentBWrapper };

declare module '@cloudscape-design/test-utils-core/dist/selectors' {
   interface ElementWrapper {
    
/**
 * Returns a wrapper that matches the TestComponentAs with the specified CSS selector.
 * If no CSS selector is specified, returns a wrapper that matches TestComponentAs.
 *
 * @param {string} [selector] CSS Selector
 * @returns {TestComponentAWrapper}
 */
findTestComponentA(selector?: string): TestComponentAWrapper;

/**
 * Returns a multi-element wrapper that matches TestComponentAs with the specified CSS selector.
 * If no CSS selector is specified, returns a multi-element wrapper that matches TestComponentAs.
 *
 * @param {string} [selector] CSS Selector
 * @returns {MultiElementWrapper<TestComponentAWrapper>}
 */
findAllTestComponentAs(selector?: string): MultiElementWrapper<TestComponentAWrapper>;
/**
 * Returns a wrapper that matches the TestComponentBs with the specified CSS selector.
 * If no CSS selector is specified, returns a wrapper that matches TestComponentBs.
 *
 * @param {string} [selector] CSS Selector
 * @returns {TestComponentBWrapper}
 */
findTestComponentB(selector?: string): TestComponentBWrapper;

/**
 * Returns a multi-element wrapper that matches TestComponentBs with the specified CSS selector.
 * If no CSS selector is specified, returns a multi-element wrapper that matches TestComponentBs.
 *
 * @param {string} [selector] CSS Selector
 * @returns {MultiElementWrapper<TestComponentBWrapper>}
 */
findAllTestComponentBs(selector?: string): MultiElementWrapper<TestComponentBWrapper>;
   }
}


ElementWrapper.prototype.findTestComponentA = function(selector) {
  const rootSelector = `.${TestComponentAWrapper.rootSelector}`;
  // casting to 'any' is needed to avoid this issue with generics
  // https://github.com/microsoft/TypeScript/issues/29132
  return (this as any).findComponent(selector ? appendSelector(selector, rootSelector) : rootSelector, TestComponentAWrapper);
};

ElementWrapper.prototype.findAllTestComponentAs = function(selector) {
  return this.findAllComponents(TestComponentAWrapper, selector);
};
ElementWrapper.prototype.findTestComponentB = function(selector) {
  const rootSelector = `.${TestComponentBWrapper.rootSelector}`;
  // casting to 'any' is needed to avoid this issue with generics
  // https://github.com/microsoft/TypeScript/issues/29132
  return (this as any).findComponent(selector ? appendSelector(selector, rootSelector) : rootSelector, TestComponentBWrapper);
};

ElementWrapper.prototype.findAllTestComponentBs = function(selector) {
  return this.findAllComponents(TestComponentBWrapper, selector);
};


/**
 * Returns the component metadata including its plural and wrapper name.
 *
 * @param {string} componentName Component name in pascal case.
 * @returns {ComponentMetadata}
 */
export function getComponentMetadata(componentName: string) {
  return {"TestComponentA":{"pluralName":"TestComponentAs","wrapperName":"TestComponentAWrapper"},"TestComponentB":{"pluralName":"TestComponentBs","wrapperName":"TestComponentBWrapper"}}[componentName];
}


export default function wrapper(root: string = 'body') {
  return new ElementWrapper(root);
}
