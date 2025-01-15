// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import fs from 'fs';
import path from 'path';
import { describe, test, expect } from 'vitest';

describe('index files', () => {
  const testUtilTypes = ['dom', 'selectors'] as const;

  test.each(testUtilTypes)('%s index file matches the snapshot', testUtilType => {
    const testUtilsIndexFilePath = path.resolve(__dirname, `./mock-test-utils/${testUtilType}/index.ts`);
    const content = fs.readFileSync(testUtilsIndexFilePath, { encoding: 'utf8' });
    expect(content).toMatchSnapshot();
  });
});
