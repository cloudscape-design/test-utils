// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { describe, test, expect } from 'vitest';
import { generateComponentFinders } from '../generate-component-finders';
import { ComponentWrapperMetadata } from '../interfaces';

const components: ComponentWrapperMetadata[] = [
  {
    name: 'Foo',
    pluralName: 'Foos',
    wrapperName: 'FooWrapper',
    wrapperImportPath: 'foo/wrapper/import/path',
  },
  {
    name: 'Bar',
    pluralName: 'Bars',
    wrapperName: 'BarWrapper',
    wrapperImportPath: 'bar/wrapper/import/path',
  },
];

describe('generates the finders for the specified list', () => {
  const testUtilTypes = ['dom', 'selectors'] as const;

  test.each(testUtilTypes)('generates component specific finders for %s', testUtilType => {
    const componentFinders = generateComponentFinders({ components, testUtilType });
    expect(componentFinders).toMatchSnapshot();
  });
});
