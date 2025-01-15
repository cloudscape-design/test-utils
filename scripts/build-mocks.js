// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('path');
const { generateTestUtils } = require('../lib/converter/dist/generate-test-utils');

const mockComponents = [
  {
    name: 'TestComponentA',
    pluralName: 'TestComponentAs',
  },
  {
    name: 'TestComponentB',
    pluralName: 'TestComponentBs',
  },
];

const testUtilsPath = path.resolve(__dirname, '../src/converter/test/mock-test-utils');
generateTestUtils({
  components: mockComponents,
  testUtilsPath,
});
