// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { describe, it, expect, beforeEach } from 'vitest';
import { ElementWrapper, createWrapper } from '../selectors';

class TestComponentWrapper extends ElementWrapper {
  findItems() {
    return this.findAll('.item').map(wrapper => new ChildComponentWrapper(wrapper.getElement()));
  }

  findSingleChild() {
    return this.findComponent('awsui-child', ChildComponentWrapper);
  }
}

class ChildComponentWrapper extends ElementWrapper {
  findTitle() {
    return this.find('.title');
  }
}

describe('CSS-selectors test utils', () => {
  let wrapper: TestComponentWrapper;

  beforeEach(() => {
    wrapper = new TestComponentWrapper('.awsui-component');
  });

  it('wraps element selector', () => {
    expect(wrapper.toSelector()).toEqual('.awsui-component');
  });

  it('builds selector to find components inside', () => {
    expect(wrapper.find('.header').toSelector()).toEqual('.awsui-component .header');
  });

  it('allows use of :scope to combine parent and child selectors', () => {
    expect(wrapper.find(':scope > .header').toSelector()).toEqual('.awsui-component > .header');
  });

  it('builds :nth-child selector for multiple elements', () => {
    expect(wrapper.findAll('.item').get(2).toSelector()).toEqual('.awsui-component .item:nth-child(2)');
  });

  it('builds selectors using class names', () => {
    const CLASS_NAME = 'element';
    expect(wrapper.findByClassName(CLASS_NAME).toSelector()).toEqual('.awsui-component .element');
    expect(wrapper.findAllByClassName(CLASS_NAME).get(2).toSelector()).toEqual(
      '.awsui-component .element:nth-child(2)'
    );
  });

  it('allows chaining to different component wrappers using .map', () => {
    expect(wrapper.findItems().get(1).findTitle().toSelector()).toEqual('.awsui-component .item:nth-child(1) .title');
  });

  it('appends selector using matches method', () => {
    expect(wrapper.findByClassName('button').matches(':focus').toSelector()).toEqual('.awsui-component .button:focus');
  });

  it('allows to find components', () => {
    expect(wrapper.findSingleChild().findTitle().toSelector()).toEqual('.awsui-component awsui-child .title');
  });

  it('converts css scoped selectors to wildcard classname selectors', () => {
    const CLASS_NAME = 'awsui_element_header_filenameHash_contentHash_3';
    expect(wrapper.find(`.${CLASS_NAME}`).toSelector()).toEqual(
      '.awsui-component [class*="awsui_element_header_filenameHash"]'
    );
    expect(wrapper.find(`:scope > .${CLASS_NAME}`).toSelector()).toEqual(
      '.awsui-component > [class*="awsui_element_header_filenameHash"]'
    );
    expect(wrapper.findByClassName(CLASS_NAME).toSelector()).toEqual(
      '.awsui-component [class*="awsui_element_header_filenameHash"]'
    );
    expect(wrapper.findAllByClassName(CLASS_NAME).get(2).toSelector()).toEqual(
      '.awsui-component [class*="awsui_element_header_filenameHash"]:nth-child(2)'
    );
  });

  it('trims scoping for multiple class names in the selector', () => {
    expect(
      wrapper
        .find(`.awsui_button_filenameHash_contentHash_3.awsui_button-active_filenameHash_contentHash_3`)
        .toSelector()
    ).toEqual('.awsui-component [class*="awsui_button_filenameHash"][class*="awsui_button-active_filenameHash"]');
  });
});

describe('createWrapper', () => {
  it('returns an ElementWrapper for the documnet body', () => {
    const actual = createWrapper().toSelector();
    expect(actual).toBe('body');
  });
});
