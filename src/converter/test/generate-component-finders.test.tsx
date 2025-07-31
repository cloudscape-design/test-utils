// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { describe, test, expect } from 'vitest';
import { generateComponentFinders } from '../generate-component-finders';
import { ComponentWrapperMetadata } from '../interfaces';

const mockComponents: ComponentWrapperMetadata[] = [
  {
    name: 'Alert',
    pluralName: 'Alerts',
    wrapperName: 'AlertWrapper',
    wrapperImportPath: './test-utils/AlertWrapper',
    testUtilsFolderName: '../test-utils',
  },
  {
    name: 'Status',
    pluralName: 'Status', // The plural name is deliberately the same as singular
    wrapperName: 'StatusWrapper',
    wrapperImportPath: './test-utils/StatusWrapper',
    testUtilsFolderName: '../test-utils',
  },
];

describe(`${generateComponentFinders.name}`, () => {
  const testUtilTypes = ['dom', 'selectors'] as const;

  describe.each(testUtilTypes)('%s', testUtilType => {
    const sourceFileContent = generateComponentFinders({ components: mockComponents, testUtilType });

    test('it re-exports element wrapper', () => {
      expect(sourceFileContent).toMatch('export { ElementWrapper }');
    });

    test('it export component wrappers', () => {
      expect(sourceFileContent).toMatch('export { AlertWrapper };');
      expect(sourceFileContent).toMatch('export { StatusWrapper };');
    });

    test('it exports interfaces', () => {
      expect(sourceFileContent).toMatch(`declare module '@cloudscape-design/test-utils-core/dist/${testUtilType}'`);

      if (testUtilType === 'dom') {
        expect(sourceFileContent).toMatch(`findAlert(selector?: Selector): AlertWrapper | null`);
        expect(sourceFileContent).toMatch(`findAllAlerts(selector?: Selector): Array<AlertWrapper>`);
        expect(sourceFileContent).toMatch(`findStatus(selector?: Selector): StatusWrapper | null`);
        expect(sourceFileContent).toMatch(`findAllStatus(selector?: Selector): Array<StatusWrapper>`);
      } else {
        expect(sourceFileContent).toMatch(`findAlert(selector?: string): AlertWrapper`);
        expect(sourceFileContent).toMatch(`findAllAlerts(selector?: string): MultiElementWrapper<AlertWrapper>`);
        expect(sourceFileContent).toMatch(`findStatus(selector?: string): StatusWrapper`);
        expect(sourceFileContent).toMatch(`findAllStatus(selector?: string): MultiElementWrapper<StatusWrapper>`);
      }
    });

    test('it adds finder implementations to the ElementWrapper', () => {
      expect(sourceFileContent).toMatch('ElementWrapper.prototype.findAlert = function(selector)');
      expect(sourceFileContent).toMatch('ElementWrapper.prototype.findAllAlerts = function(selector)');
      expect(sourceFileContent).toMatch('ElementWrapper.prototype.findStatus = function(selector)');
      expect(sourceFileContent).toMatch('ElementWrapper.prototype.findAllStatus = function(selector)');
    });

    test('it exports the wrapper creator', () => {
      if (testUtilType === 'dom') {
        expect(sourceFileContent).toMatch('export default function wrapper(root: Element = document.body)');
      } else {
        expect(sourceFileContent).toMatch(`export default function wrapper(root: string = 'body')`);
      }
    });
  });
});
