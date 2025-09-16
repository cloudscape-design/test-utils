// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { describe, test, it, expect } from 'vitest';
import { appendSelector, getUnscopedClassName } from '../utils';

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
      /Appended selector may not contain a combinator/,
    );
  });
});

describe('getUnscopedClassName', () => {
  it('transforms scoped class names to attribute selectors', () => {
    expect(getUnscopedClassName('.awsui_button_1ueyk_1xee3_5')).toBe('[class*="awsui_button_1ueyk"]');
  });

  it('leaves non-scoped class names unchanged', () => {
    expect(getUnscopedClassName('.regular-class')).toBe('.regular-class');
  });

  it('handles :is() with scoped classes', () => {
    expect(getUnscopedClassName(':is(.awsui_button_1ueyk_1xee3_5, .awsui_button_1xzyz_1xdd2_3)')).toBe(
      ':is([class*="awsui_button_1ueyk"], [class*="awsui_button_1xzyz"])',
    );
  });

  it('leaves :is() with non-scoped classes unchanged', () => {
    expect(getUnscopedClassName(':is(.awsui-first, .awsui-second)')).toBe(':is(.awsui-first, .awsui-second)');
  });

  it('handles complex selector with :is() and additional content', () => {
    expect(
      getUnscopedClassName(
        '.awsui-component :is(.awsui_button_1ueyk_1xee3_5, .awsui_button_1xyzy_1xdd2_3) .awsui_inner_1ueyk_1xee3_5',
      ),
    ).toBe(
      '.awsui-component :is([class*="awsui_button_1ueyk"], [class*="awsui_button_1xyzy"]) [class*="awsui_inner_1ueyk"]',
    );
  });

  it('handles :is() with pseudo-classes', () => {
    expect(getUnscopedClassName(':is(.awsui_button_1ueyk_1xee3_5, .awsui_old):hover')).toBe(
      ':is([class*="awsui_button_1ueyk"], .awsui_old):hover',
    );
  });

  it('handles multiple :is() in one selector', () => {
    expect(getUnscopedClassName(':is(.awsui_button_1ueyk_1xee3_5):hover :is(.awsui_icon_1xyzy_1xdd2_3)')).toBe(
      ':is([class*="awsui_button_1ueyk"]):hover :is([class*="awsui_icon_1xyzy"])',
    );
  });

  it('handles mixed scoped and non-scoped classes in :is()', () => {
    expect(getUnscopedClassName(':is(.regular-class, .awsui_button_1ueyk_1xee3_5, .another-class)')).toBe(
      ':is(.regular-class, [class*="awsui_button_1ueyk"], .another-class)',
    );
  });
});
