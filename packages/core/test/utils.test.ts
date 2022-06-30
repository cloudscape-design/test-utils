// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { appendSelector } from '../src/utils';

describe('appendSelector', () => {
  test('appends selectors', () => {
    expect(appendSelector('.button', '.active')).toEqual('.button.active');
    expect(appendSelector('.root .button', '.active')).toEqual('.root .button.active');
    expect(appendSelector('.button:focus', '.active')).toEqual('.button.active:focus');
    expect(appendSelector('.button:focus', '.active:hover')).toEqual('.button.active:hover:focus');
    expect(appendSelector('.button', ':focus')).toEqual('.button:focus');
  });

  test('throws error when original string is a multi-selector', () => {
    expect(() => appendSelector('.button, .input', ':focus')).toThrow(/Multi-selector strings are not supported/);
  });

  test('throws error when additional string is a multi-selector', () => {
    expect(() => appendSelector('.button', '.active, .selected')).toThrow(/Multi-selector strings are not supported/);
  });

  test('throws error when additional string is a cascade selector', () => {
    expect(() => appendSelector('.button', '.selected .icon')).toThrow(
      /Appended selector may not contain a combinator/
    );
  });
});
