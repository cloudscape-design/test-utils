// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import path from 'path';
import fs from 'fs';
import { generateComponentFinders } from './generate-component-finders';
import { ComponentWrapperMetadata, GenerateTestUtilsParams, TestUtilType } from './interfaces';
import { writeSourceFile } from './utils';
import { kebabCase } from 'lodash';
import { convertToSelectorUtil } from './convert-to-selectors';
import glob from 'glob';

interface GenerateIndexFilesParams extends GenerateTestUtilsParams {
  testUtilType: TestUtilType;
}

function generateIndexFile({ testUtilsPath, components, testUtilType }: GenerateIndexFilesParams) {
  const componenWrappersMetadata: ComponentWrapperMetadata[] = components.map(
    ({ name, pluralName, testUtilsFolderName }) => ({
      name,
      pluralName,
      wrapperName: `${name}Wrapper`,
      wrapperImportPath: `./${testUtilsFolderName ?? kebabCase(name)}`,
    }),
  );

  const content = generateComponentFinders({ testUtilType, components: componenWrappersMetadata });
  const indexFilePath = path.join(testUtilsPath, testUtilType, 'index.ts');
  writeSourceFile(indexFilePath, content);
}

function generateSelectorUtils(testUtilsPath: string) {
  const domFolderPath = path.join(testUtilsPath, 'dom');
  const selectorsFolderPath = path.join(testUtilsPath, 'selectors');
  const conversionTargetRelativePaths = glob.sync(`**/*.{ts,tsx}`, { cwd: domFolderPath });

  if (conversionTargetRelativePaths.length === 0) {
    throw new Error(`No file with ts or tsx extension found at: ${domFolderPath}`);
  }

  for (const fileRelativePath of conversionTargetRelativePaths) {
    const domFilePath = path.join(domFolderPath, fileRelativePath);
    const domFileContent = fs.readFileSync(domFilePath, 'utf-8');
    const selectorsFilePath = path.join(selectorsFolderPath, fileRelativePath);
    const selectorsFileContent = convertToSelectorUtil(domFileContent);

    if (!selectorsFileContent) {
      throw new Error('Converted file content is empty');
    }
    writeSourceFile(selectorsFilePath, selectorsFileContent);
  }
}

/**
 * Generates test utils index files for dom and selector and converts the dom test utils to selectors.
 */
export function generateTestUtils({ components, testUtilsPath }: GenerateTestUtilsParams) {
  generateSelectorUtils(testUtilsPath);
  generateIndexFile({ components, testUtilsPath, testUtilType: 'dom' });
  generateIndexFile({ components, testUtilsPath, testUtilType: 'selectors' });
}
