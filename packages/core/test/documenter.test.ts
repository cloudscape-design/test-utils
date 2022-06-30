// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-var-requires */

const domDefinition = require('../test-utils-doc/dom');
const selectorsDefinition = require('../test-utils-doc/dom');

describe('documenter output', () => {
  test('dom', () => {
    expect(domDefinition).toMatchSnapshot();
  });
  test('selectors', () => {
    expect(selectorsDefinition).toMatchSnapshot();
  });
});
