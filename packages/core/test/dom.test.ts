// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/*eslint-env browser*/
import { describe, beforeEach, afterEach, it, expect, test } from 'vitest';
import { ElementWrapper, ComponentWrapper, createWrapper } from '../src/dom';
import { KeyCode } from '../src/utils';

describe('DOM test utils', () => {
  let node: HTMLElement, wrapper: ElementWrapper;
  const CLASS_NAME = 'some-class';

  beforeEach(() => {
    // create test HTML
    node = document.createElement('div');
    node.innerHTML = `
      <div>
        <a>1</a>
        <a>1</a>
      </div>
      <div>
        <a>2</a>
        <a>2</a>
      </div>
      <button class="${CLASS_NAME} active">1</button>
      <button class="${CLASS_NAME}">1</button>
      <div>
        <button>2</button>
        <button>2</button>
      </div>
    `;
    document.body.appendChild(node);

    wrapper = new ElementWrapper(node);
  });

  afterEach(() => {
    document.body.removeChild(node);
  });

  describe('ElementWrapper', () => {
    it('getElement returns a dom element', () => {
      const result = wrapper.getElement();
      expect(result).toEqual(expect.any(HTMLElement));
      expect(result).toEqual(node);
    });

    it('click() dispatches a click event on the element with default details', () => {
      let event: MouseEvent | undefined;

      const element = wrapper.getElement();
      element.addEventListener('click', arg => (event = arg));
      wrapper.click();
      expect(event).toBeDefined();
      expect(event!.shiftKey).toBe(false);
      expect(event!.ctrlKey).toBe(false);
      expect(event!.metaKey).toBe(false);
      expect(event!.altKey).toBe(false);
      expect(event!.button).toBe(0);
    });

    it('click() allows to specify modifier keys', () => {
      let event: MouseEvent | undefined;

      const element = wrapper.getElement();
      element.addEventListener('click', arg => (event = arg));
      wrapper.click({ ctrlKey: true, shiftKey: true, altKey: true, metaKey: true, button: 1 });

      expect(event).toBeDefined();
      expect(event!.shiftKey).toBe(true);
      expect(event!.ctrlKey).toBe(true);
      expect(event!.metaKey).toBe(true);
      expect(event!.altKey).toBe(true);
      expect(event!.button).toBe(1);
    });

    it('keydown() dispatches a keydown event on the element', () => {
      let event: KeyboardEvent | undefined;

      const element = wrapper.getElement();
      element.addEventListener('keydown', e => (event = e));
      wrapper.keydown(KeyCode.enter);
      expect(event).toBeDefined();
      expect(event!.keyCode).toBe(KeyCode.enter);
    });

    it('keypress() dispatches a keypress event on the element with a charCode', () => {
      let event: KeyboardEvent | undefined;

      const element = wrapper.getElement();
      element.addEventListener('keypress', e => (event = e));
      wrapper.keypress(KeyCode.space);
      expect(event).toBeDefined();
      expect(event!.keyCode).toBe(KeyCode.space);
      expect(event!.charCode).toBe(KeyCode.space);
    });

    it('element can be focused and blurred', () => {
      const element = wrapper.getElement();

      // make it focusable
      element.setAttribute('tabindex', '0');

      wrapper.focus();
      expect(element).toBe(document.activeElement);

      wrapper.blur();
      expect(element).not.toBe(document.activeElement);
    });

    describe('findAll()', () => {
      it('returns all ElementWrappers with a specified selector', () => {
        const result = wrapper.findAll('div a');
        expect(result).toHaveLength(4);
      });

      it('returns an empty array if no elements were found', () => {
        const result = wrapper.findAll('article');
        expect(result).toHaveLength(0);
      });

      it('return only instances of ElementWrapper', () => {
        const result = wrapper.findAll<HTMLAnchorElement>('div a');
        result.forEach(element => expect(element).toEqual(expect.any(ElementWrapper)));
      });

      it('allows to narrow the type of element', () => {
        const result = wrapper.findAll<HTMLAnchorElement>('div a');
        // checking an property that only exists on HTMLAnchorElement
        expect(result[0].getElement().href).toEqual('');
      });

      it('allows use of :scope', () => {
        const result = wrapper.findAll<HTMLAnchorElement>(':scope > div > a');
        // checking an property that only exists on HTMLAnchorElement
        expect(result[0].getElement().href).toEqual('');
      });

      it('uses existing behavior if the descendant (" ") combinator is used', () => {
        const results = wrapper.findAll<HTMLAnchorElement>('a');
        const scopeResults = wrapper.findAll<HTMLAnchorElement>(':scope a');
        expect(results).toEqual(scopeResults);
      });

      it('does not match deeply nested elements when ">" combinator is used', () => {
        const results = wrapper.findAll<HTMLAnchorElement>(':scope > a');
        expect(results).toHaveLength(0);
      });
    });

    describe('find()', () => {
      it('returns the first element with a specified selector', () => {
        const result = wrapper.find('div a');
        expect(result!.getElement().innerHTML).toEqual('1');
      });

      it('allows to narrow the type of the element', () => {
        const result = wrapper.find<HTMLButtonElement>('button');
        // checking an property that only exists on HTMLButtonElement
        expect(result!.getElement().disabled).toEqual(false);
      });

      it('returns null if an element was not found', () => {
        const result = wrapper.find('article');
        expect(result).toEqual(null);
      });
    });

    describe('matches()', () => {
      it('returns the same element if it matches extra selector', () => {
        const button = wrapper.find('button')!;
        expect(button.matches('.active')!.getElement()).toEqual(button.getElement());
      });

      it('returns null if element does not match extra selector', () => {
        const button = wrapper.find('button')!;
        expect(button.matches('.non-existing')).toBeNull();
      });
    });

    describe('findByClassName()', () => {
      it('finds elements by class name', () => {
        const result = wrapper.findByClassName(CLASS_NAME);
        expect(result!.getElement().innerHTML).toEqual('1');
      });
    });

    describe('findAllByClassName()', () => {
      it('finds all elements by class name', () => {
        const result = wrapper.findAllByClassName(CLASS_NAME);
        expect(result).toHaveLength(2);
      });
    });

    describe('findComponent()', () => {
      class BlockWrapper extends ComponentWrapper<any> {
        findSubBlock() {
          return this.findComponent('div', BlockWrapper);
        }
      }

      it('returns component wrapper if it is found', () => {
        const wrapper = new BlockWrapper(node);
        const result = wrapper.findSubBlock();
        expect(result).toEqual(expect.any(BlockWrapper));
      });

      it('returns null if an component was not found', () => {
        const wrapper = new BlockWrapper(node);
        const result = wrapper.findSubBlock()!.findSubBlock();
        expect(result).toEqual(null);
      });
    });
  });
  describe('createWrapper', () => {
    test('returns an ElementWrapper of the document body', () => {
      const actual = createWrapper().getElement();
      expect(actual).toBe(document.body);
    });
  });
});
