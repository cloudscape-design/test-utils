// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import path from 'path';
import fs from 'fs';
import { generateTestUtils } from './index';
import { ComponentMetadata } from './interfaces';

/*
 * When importing generated files using `import` statement,
 * the file should exist in the build time.
 * For this reason, we generate the files before the test begins.
 */
function prepareGeneratorTests() {
  const components: ComponentMetadata[] = [
    {
      name: 'TestComponentA',
      pluralName: 'TestComponentAs',
    },
    {
      name: 'TestComponentB',
      pluralName: 'TestComponentBs',
    },
  ];

  const selectorsFolderPath = path.resolve(__dirname, './test/mock-test-utils/selectors');
  const domIndexFilePath = path.resolve(__dirname, './test/mock-test-utils/index.ts');
  const testUtilsPath = path.resolve(__dirname, './test/mock-test-utils');

  if (fs.existsSync(selectorsFolderPath)) {
    fs.rmSync(selectorsFolderPath, { recursive: true });
  }
  if (fs.existsSync(domIndexFilePath)) {
    fs.rmSync(domIndexFilePath);
  }

  generateTestUtils({
    components,
    testUtilsPath,
  });
}

prepareGeneratorTests();
