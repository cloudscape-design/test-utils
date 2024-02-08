// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-var-requires */
import { describe, test, expect } from 'vitest';
const domDefinition = require('../../../lib/core/test-utils-doc/dom');
const selectorsDefinition = require('../../../lib/core/test-utils-doc/selectors');

describe('documenter output', () => {
  test('dom', () => {
    expect(domDefinition).toMatchSnapshot();
  });
  test('selectors', () => {
    expect(selectorsDefinition).toMatchSnapshot();
  });
});
