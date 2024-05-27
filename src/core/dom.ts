// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/*eslint-env browser*/
import * as React from 'react';
import { act as reactDomAct } from 'react-dom/test-utils';
import { IElementWrapper } from './interfaces';
import { KeyCode, isScopedSelector, substituteScope } from './utils';
const act = ('act' in React ? React.act : reactDomAct) as typeof reactDomAct;

// Original KeyboardEventInit lacks some properties https://github.com/Microsoft/TypeScript/issues/15228
declare global {
  interface KeyboardEventInit {
    char?: string;
    keyCode?: number;
    charCode?: number;
  }
}

// Used as decorator to mark dom-only methods in test-utils
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const usesDom: MethodDecorator = () => {};

const defaultParams = {
  bubbles: true,
  cancelable: true,
};

export class AbstractWrapper<ElementType extends Element>
  implements IElementWrapper<ElementType, Array<ElementWrapper<ElementType>>>
{
  protected element: ElementType;

  constructor(element: ElementType) {
    this.element = element;
  }

  getElement() {
    return this.element;
  }

  /**
   * Performs a click by triggering a mouse event.
   * Note that programmatic events ignore disabled attribute and will trigger listeners even if the element is disabled.
   */
  click(params?: MouseEventInit) {
    this.fireEvent(new MouseEvent('click', { ...defaultParams, ...params }));
  }

  keydown(keyCode: KeyCode): void;
  keydown(keyboardEventProps: KeyboardEventInit): void;
  keydown(args: KeyboardEventInit | KeyCode) {
    const params = typeof args === 'object' ? args : { keyCode: args };
    this.fireEvent(new KeyboardEvent('keydown', { ...defaultParams, ...params }));
  }

  keyup(keyCode: KeyCode) {
    this.fireEvent(new KeyboardEvent('keyup', { ...defaultParams, keyCode }));
  }

  keypress(keyCode: KeyCode) {
    // React more or less requires charCode to be set on keypress events
    // https://github.com/facebook/react/blob/d95c4938df670a8f0a13267bd89173737bb185e4/packages/react-dom/src/events/plugins/SimpleEventPlugin.js#L67-L74
    this.fireEvent(new KeyboardEvent('keypress', { ...defaultParams, keyCode, charCode: keyCode }));
  }

  fireEvent(event: Event) {
    act(() => {
      this.element.dispatchEvent(event);
    });
  }

  focus() {
    if (this.element instanceof HTMLElement || this.element instanceof SVGElement) {
      const element = this.element;
      act(() => {
        element.focus();
      });
    } else {
      throw new Error('Focus method is not supported for this element type');
    }
  }

  blur() {
    if (this.element instanceof HTMLElement || this.element instanceof SVGElement) {
      const element = this.element;
      act(() => {
        element.blur();
      });
    } else {
      throw new Error('Blur method is not supported for this element type');
    }
  }

  find<NewElementType extends Element = HTMLElement>(selector: string): ElementWrapper<NewElementType> | null {
    return this.findAll<NewElementType>(selector)[0] || null;
  }

  matches(selector: string): this | null {
    return this.element.matches(selector) ? this : null;
  }

  findAll<NewElementType extends Element = HTMLElement>(selector: string) {
    let elements: Array<NewElementType>;
    if (isScopedSelector(selector)) {
      const randomValue = Math.floor(Math.random() * 100000);
      const attributeName = `data-awsui-test-scope-${randomValue}`;
      const domSelector = substituteScope(selector, `[${attributeName}]`);
      this.getElement().setAttribute(attributeName, '');
      elements = Array.prototype.slice.call(this.element.querySelectorAll(domSelector));
      this.getElement().removeAttribute(attributeName);
    } else {
      elements = Array.prototype.slice.call(this.element.querySelectorAll(selector));
    }
    return elements.map(element => new ElementWrapper(element));
  }

  findByClassName<NewElementType extends HTMLElement = HTMLElement>(className: string) {
    return this.find<NewElementType>(`.${className}`);
  }

  findAllByClassName<NewElementType extends HTMLElement = HTMLElement>(className: string) {
    return this.findAll<NewElementType>(`.${className}`);
  }

  findComponent<Wrapper extends ComponentWrapper<ElementType>, ElementType extends HTMLElement>(
    selector: string,
    ComponentClass: { new (element: ElementType): Wrapper }
  ): Wrapper | null {
    const elementWrapper = this.find<ElementType>(selector);
    return elementWrapper ? new ComponentClass(elementWrapper.getElement()) : null;
  }
}

export class ElementWrapper<ElementType extends Element = HTMLElement> extends AbstractWrapper<ElementType> {}
export class ComponentWrapper<ElementType extends Element = HTMLElement> extends AbstractWrapper<ElementType> {}
export function createWrapper(root: Element = document.body) {
  if (document && document.body && !document.body.contains(root)) {
    console.warn(
      '[AwsUi] [test-utils] provided element is not part of the document body, interactions may work incorrectly'
    );
  }
  return new ElementWrapper(root);
}
