// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { IElementWrapper } from './interfaces';
import { appendSelector, isScopedSelector, substituteScope, getUnscopedClassName } from './utils';

const getRootSelector = (selector: string, root: string): string => {
  const rootSelector = isScopedSelector(selector) ? substituteScope(selector, root) : `${root} ${selector}`;
  return getUnscopedClassName(rootSelector);
};

export class AbstractWrapper implements IElementWrapper<string, MultiElementWrapper<ElementWrapper>> {
  constructor(protected root: string) {}

  getElement() {
    return this.root;
  }

  matches(selector: string) {
    return new ElementWrapper(appendSelector(this.root, getUnscopedClassName(selector)));
  }

  find(selector: string): ElementWrapper {
    return new ElementWrapper(getRootSelector(selector, this.root));
  }

  findAll(selector: string): MultiElementWrapper<ElementWrapper> {
    return new MultiElementWrapper(getRootSelector(selector, this.root), selector => new ElementWrapper(selector));
  }

  findByClassName(className: string) {
    return this.find(`.${className}`);
  }

  findAllByClassName(className: string) {
    return this.findAll(`.${className}`);
  }

  findComponent<Wrapper extends ComponentWrapper>(
    selector: string,
    ComponentClass: { new (element: string): Wrapper }
  ): Wrapper {
    return new ComponentClass(this.find(selector).getElement());
  }

  toSelector(): string {
    return this.root;
  }
}

export class ElementWrapper extends AbstractWrapper {}

export class ComponentWrapper extends AbstractWrapper {}

export class MultiElementWrapper<T extends AbstractWrapper> extends ElementWrapper {
  constructor(root: string, private elementFactory: (selector: string) => T) {
    super(root);
  }

  /**
   * Index is one-based because the method uses the :nth-child() CSS pseudo-class.
   */
  get(index: number): T {
    return this.elementFactory(`${this.root}:nth-child(${index})`);
  }

  map<T extends AbstractWrapper>(factory: (wrapper: ElementWrapper) => T): MultiElementWrapper<T> {
    return new MultiElementWrapper(this.root, root => factory(new ElementWrapper(root)));
  }
}
export function createWrapper(root = 'body') {
  return new ElementWrapper(root);
}
