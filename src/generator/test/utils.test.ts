// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { describe, test, expect } from 'vitest';
import { ComponentMetadata } from '../interfaces';
import { buildComponentsMetadataMap } from '../utils';

const testComponents: ComponentMetadata[] = [
  {
    name: 'ComponentA',
    pluralName: 'ComponentAs',
    wrapperImportPath: 'relative/path/to/component/a/wrapper',
    wrapperName: 'ComponentAWrapper',
  },
  {
    name: 'ComponentB',
    pluralName: 'ComponentBs',
    wrapperImportPath: 'relative/path/to/component/b/wrapper',
    wrapperName: 'ComponentBWrapper',
  },
];

describe(`${buildComponentsMetadataMap.name}`, () => {
  test('builds a map with component name as key', () => {
    const metadataMap = buildComponentsMetadataMap(testComponents);

    expect(metadataMap).toEqual(
      JSON.stringify({
        ComponentA: {
          pluralName: 'ComponentAs',
          wrapperName: 'ComponentAWrapper',
        },
        ComponentB: {
          pluralName: 'ComponentBs',
          wrapperName: 'ComponentBWrapper',
        },
      })
    );
  });

  test('does not pass the non-public data', () => {
    const metadataMapString = buildComponentsMetadataMap(testComponents);
    const metadataMap = JSON.parse(metadataMapString);

    expect(metadataMap.ComponentA).not.toHaveProperty('wrapperImportPath');
  });
});
