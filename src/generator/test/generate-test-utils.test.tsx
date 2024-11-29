// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import ReactDOM from 'react-dom';
import { generateTestUtils } from '../index';
import { describe, test, expect } from 'vitest';

function renderTestNode() {
  const testNode = (
    <>
      <div className="test-component-a-root">
        <h1 className="test-component-a-child">First Component A</h1>
      </div>
      <div className="test-component-b-root">
        <h1 className="test-component-b-child">First Component B</h1>
      </div>
      <div className="test-component-a-root">
        <h1 className="test-component-a-child">Second Component A</h1>
      </div>
      <div className="test-component-b-root">
        <h1 className="test-component-b-child">Second Component B</h1>
      </div>
    </>
  );

  const container = document.createElement('body');
  ReactDOM.render(testNode, container);
  return container;
}

describe(`${generateTestUtils.name}`, () => {
  describe('generated dom index file', () => {
    test('component finders return the first matching node', async () => {
      const { default: createWrapper } = await import('./mock-test-utils/dom');
      const container = renderTestNode();
      const wrapper = createWrapper(container);

      expect(wrapper.findTestComponentA().getElement().textContent).toBe('First Component A');
      expect(wrapper.findTestComponentB().getElement().textContent).toBe('First Component B');
    });

    test('component collection finders return all of the matching nodes', async () => {
      const { default: createWrapper } = await import('./mock-test-utils/dom');
      const container = renderTestNode();
      const wrapper = createWrapper(container);

      const componentATextContents = wrapper
        .findAllTestComponentAs()
        .map(wrapper => wrapper.getElement().textContent)
        .join();
      const componentBTextContents = wrapper
        .findAllTestComponentBs()
        .map(wrapper => wrapper.getElement().textContent)
        .join();

      expect(componentATextContents).toBe('First Component A,Second Component A');
      expect(componentBTextContents).toBe('First Component B,Second Component B');
    });
  });

  describe('generated selectors index file', () => {
    test('component finders return the selector matching the first component', async () => {
      const { default: createWrapper } = await import('./mock-test-utils/selectors');
      const container = renderTestNode();
      const wrapper = createWrapper();

      const componentASelector = wrapper.findTestComponentA().toSelector();
      const componentBSelector = wrapper.findTestComponentB().toSelector();

      expect(container.querySelector(componentASelector).textContent).toBe('First Component A');
      expect(container.querySelector(componentBSelector).textContent).toBe('First Component B');
    });

    test('component collection finders return multi-wrappers matching the component', async () => {
      const { default: createWrapper } = await import('./mock-test-utils/selectors');
      const container = renderTestNode();
      const wrapper = createWrapper();

      const secondComponentASelector = wrapper.findAllTestComponentAs().get(3).toSelector();
      const secondComponentBSelector = wrapper.findAllTestComponentBs().get(4).toSelector();

      expect(container.querySelector(secondComponentASelector).textContent).toBe('Second Component A');
      expect(container.querySelector(secondComponentBSelector).textContent).toBe('Second Component B');
    });
  });

  describe('generated selectors wrapper files', () => {
    test('transpiled finders return selectors matching the correct node', async () => {
      const { default: createWrapper } = await import('./mock-test-utils/selectors');
      const container = renderTestNode();
      const wrapper = createWrapper();

      const componentAChildSelector = wrapper.findTestComponentA().findChild().toSelector();
      const componentBChildSelector = wrapper.findTestComponentB().findChild().toSelector();

      expect(container.querySelector(componentAChildSelector).textContent).toBe('First Component A');
      expect(container.querySelector(componentBChildSelector).textContent).toBe('First Component B');
    });
  });
});
