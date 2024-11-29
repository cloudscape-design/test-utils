// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import path from 'path';
import fs from 'fs';
import { generateComponentFinders } from './generate-component-finders';
import { ComponentWrapperMetadata, GenerateTestUtilsParams, TestUtilType } from './interfaces';
import { writeSourceFile } from './utils';
import lodash from 'lodash';
import { convertToSelectorUtil } from './convert-to-selectors';

interface GenerateIndexFilesParams extends GenerateTestUtilsParams {
  testUtilType: TestUtilType;
}

function generateIndexFile({ testUtilsPath, components, testUtilType }: GenerateIndexFilesParams) {
  const componenWrappersMetadata: ComponentWrapperMetadata[] = components.map(({ name, pluralName }) => ({
    name,
    pluralName,
    wrapperName: `${name}Wrapper`,
    wrapperImportPath: `./${lodash.kebabCase(name)}`,
  }));

  const content = generateComponentFinders({ testUtilType, components: componenWrappersMetadata });
  const indexFilePath = path.join(testUtilsPath, testUtilType, 'index.ts');
  writeSourceFile(indexFilePath, content);
}

function generateSelectorUtils({ components, testUtilsPath }: GenerateTestUtilsParams) {
  for (const component of components) {
    const componentNameKebabCase = lodash.kebabCase(component.name);
    const domFilePath = path.join(testUtilsPath, `dom/${componentNameKebabCase}/index.ts`);
    const domFileContent = fs.readFileSync(domFilePath, 'utf-8');
    const selectorsFilePath = path.join(testUtilsPath, `selectors/${componentNameKebabCase}/index.ts`);
    const selectorsFileContent = convertToSelectorUtil(domFileContent);

    if (!selectorsFileContent) {
      throw new Error('Converted file content is empty');
    }
    writeSourceFile(selectorsFilePath, selectorsFileContent);
  }
}

/**
 * Generates test utils index files for dom and selector.
 * Converts the test utils dom test utils to selectors.
 */
export function generateTestUtils({ components, testUtilsPath }: GenerateTestUtilsParams) {
  generateSelectorUtils({ components, testUtilsPath });
  generateIndexFile({ components, testUtilsPath, testUtilType: 'dom' });
  generateIndexFile({ components, testUtilsPath, testUtilType: 'selectors' });
}
