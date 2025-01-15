// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { readFileSync, writeFileSync } from 'fs';
import { describe, test, expect, beforeAll, beforeEach, vi } from 'vitest';
import { convertToSelectorUtil } from '../convert-to-selectors';
import { generateTestUtils } from '../generate-test-utils';
import { ComponentMetadata } from '../interfaces';

vi.mock('fs');
vi.mock('../convert-to-selectors');

const mockComponents: ComponentMetadata[] = [
  {
    name: 'Alert',
    pluralName: 'Alerts',
    testUtilsFolderName: '../test-utils',
  },
];

describe(`${generateTestUtils.name}`, () => {
  beforeAll(() => {
    vi.mocked(readFileSync).mockReturnValue('file content');
    vi.mocked(convertToSelectorUtil).mockImplementation(input => input);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('generates the selector utils for the given dom utils', () => {
    generateTestUtils({
      components: mockComponents,
      testUtilsPath: './test/mock-test-utils',
    });

    expect(convertToSelectorUtil).toHaveBeenCalledWith('file content');
  });

  test('throws an error with the path if the specified path has no matching file', () => {
    const runGenerateTestUtils = () =>
      generateTestUtils({
        components: mockComponents,
        testUtilsPath: './some-invalid-path/mock-test-utils',
      });

    expect(runGenerateTestUtils).toThrowError(
      new Error(`No file with ts or tsx extension found at: some-invalid-path/mock-test-utils/dom`)
    );

    expect(convertToSelectorUtil).not.toHaveBeenCalled();
  });

  const testUtilsType = ['dom', 'selectors'] as const;
  test.each(testUtilsType)('generates the index file for %s test utils', testUtilType => {
    generateTestUtils({
      components: mockComponents,
      testUtilsPath: './test/mock-test-utils',
    });

    const testUtilsFilePartialContent = 'ElementWrapper.prototype.findAlert';

    expect(writeFileSync).toHaveBeenCalledWith(
      `test/mock-test-utils/${testUtilType}/index.ts`,
      expect.stringMatching(testUtilsFilePartialContent)
    );
  });
});
