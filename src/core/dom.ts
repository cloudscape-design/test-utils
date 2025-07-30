// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/*eslint-env browser*/
import { IElementWrapper } from './interfaces';
import { KeyCode, isScopedSelector, substituteScope, appendSelector, createComparator, Comparator } from './utils';
import { act } from './utils-dom';
import { computeAccessibleDescription, computeAccessibleName } from 'dom-accessibility-api';

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

interface WrapperClass<Wrapper, ElementType> {
  new (element: ElementType): Wrapper;
}

interface ComponentWrapperClass<Wrapper, ElementType> extends WrapperClass<Wrapper, ElementType> {
  rootSelector: string;
}

type Selector =
  | string
  | {
      name?: Comparator;
      description?: Comparator;
      textContent?: Comparator;
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

  find<NewElementType extends Element = HTMLElement>(
    rootSelector: string,
    selector?: Selector,
  ): ElementWrapper<NewElementType> | null {
    return this.findAll<NewElementType>(rootSelector, selector)[0] || null;
  }

  matches(selector: string): this | null {
    return this.element.matches(selector) ? this : null;
  }

  findAll<NewElementType extends Element = HTMLElement>(rootSelector: string, selector?: Selector) {
    let elements: Array<NewElementType>;
    const combinedSelector = typeof selector === 'string' ? appendSelector(rootSelector, selector) : rootSelector;
    if (isScopedSelector(combinedSelector)) {
      const randomValue = Math.floor(Math.random() * 100000);
      const attributeName = `data-awsui-test-scope-${randomValue}`;
      const domSelector = substituteScope(combinedSelector, `[${attributeName}]`);
      this.getElement().setAttribute(attributeName, '');
      elements = Array.prototype.slice.call(this.element.querySelectorAll(domSelector));
      this.getElement().removeAttribute(attributeName);
    } else {
      elements = Array.prototype.slice.call(this.element.querySelectorAll(combinedSelector));
    }

    if (selector && typeof selector === 'object') {
      // TODO: validate parts of selector
      elements = elements.filter(element => {
        if (selector.name) {
          const comparator = createComparator(selector.name);
          if (!comparator(computeAccessibleName(element))) {
            return false;
          }
        }
        if (selector.description) {
          const comparator = createComparator(selector.description);
          if (!comparator(computeAccessibleDescription(element))) {
            return false;
          }
        }
        if (selector.textContent) {
          const comparator = createComparator(selector.textContent);
          if (!comparator(element.textContent || '')) {
            return false;
          }
        }
        return true;
      });
      // TODO: messaging if selector filters out all options?
    }

    return elements.map(element => new ElementWrapper(element));
  }

  findAny<NewElementType extends Element = HTMLElement>(
    ...selectors: Array<string>
  ): ElementWrapper<NewElementType> | null {
    return this.find(selectors.join(', '));
  }

  findByClassName<NewElementType extends HTMLElement = HTMLElement>(className: string) {
    return this.find<NewElementType>(`.${className}`);
  }

  findAllByClassName<NewElementType extends HTMLElement = HTMLElement>(className: string) {
    return this.findAll<NewElementType>(`.${className}`);
  }

  /**
   * Returns the component wrapper matching the specified selector.
   * If the specified selector doesn't match any element, it returns `null`.
   *
   * Note: This function returns the specified component's wrapper even if the specified selector points to a different component type.
   *
   * @param {string} selector CSS selector
   * @param {WrapperClass} ComponentClass Component's wrapper class
   * @returns `Wrapper | null`
   */
  findComponent<Wrapper extends ComponentWrapper, ElementType extends HTMLElement>(
    rootSelector: string,
    ComponentClass: WrapperClass<Wrapper, ElementType>,
    selector?: Selector,
  ): Wrapper | null {
    const elementWrapper = this.find<ElementType>(rootSelector, selector);
    return elementWrapper ? new ComponentClass(elementWrapper.getElement()) : null;
  }

  /**
   * Returns the wrappers of all components that match the specified component type and the specified CSS selector.
   * If no CSS selector is specified, returns all of the components that match the specified component type.
   * If no matching component is found, returns an empty array.
   *
   * @param {ComponentWrapperClass} ComponentClass Component's wrapper class
   * @param {string} [selector] CSS selector
   * @returns `Array<Wrapper>`
   */
  findAllComponents<Wrapper extends ComponentWrapper, ElementType extends HTMLElement>(
    ComponentClass: ComponentWrapperClass<Wrapper, ElementType>,
    selector?: Selector,
  ): Array<Wrapper> {
    const componentRootSelector = `.${ComponentClass.rootSelector}`;
    const elementWrappers = this.findAll<ElementType>(componentRootSelector, selector);
    return elementWrappers.map(wrapper => new ComponentClass(wrapper.getElement()));
  }
}

export class ElementWrapper<ElementType extends Element = HTMLElement> extends AbstractWrapper<ElementType> {}
export class ComponentWrapper<ElementType extends Element = HTMLElement> extends AbstractWrapper<ElementType> {}
export function createWrapper(root: Element = document.body) {
  if (document && document.body && !document.body.contains(root)) {
    console.warn(
      '[AwsUi] [test-utils] provided element is not part of the document body, interactions may work incorrectly',
    );
  }
  return new ElementWrapper(root);
}
