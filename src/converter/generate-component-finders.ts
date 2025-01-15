// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapperMetadata, TestUtilType } from './interfaces';

const componentWrapperImport = ({ wrapperName, wrapperImportPath }: ComponentWrapperMetadata) => `
import ${wrapperName} from '${wrapperImportPath}';`;

const componentWrapperExport = ({ wrapperName }: ComponentWrapperMetadata) => `
export { ${wrapperName} };`;

const componentFinders = ({ name, wrapperName, pluralName }: ComponentWrapperMetadata) => `
ElementWrapper.prototype.find${name} = function(selector) {
  const rootSelector = \`.$\{${wrapperName}.rootSelector}\`;
  // casting to 'any' is needed to avoid this issue with generics
  // https://github.com/microsoft/TypeScript/issues/29132
  return (this as any).findComponent(selector ? appendSelector(selector, rootSelector) : rootSelector, ${wrapperName});
};

ElementWrapper.prototype.findAll${pluralName} = function(selector) {
  return this.findAllComponents(${wrapperName}, selector);
};`;

const componentFindersInterfaces = {
  dom: ({ name, pluralName, wrapperName }: ComponentWrapperMetadata) => `
/**
 * Returns the wrapper of the first ${name} that matches the specified CSS selector.
 * If no CSS selector is specified, returns the wrapper of the first ${name}.
 * If no matching ${name} is found, returns \`null\`.
 *
 * @param {string} [selector] CSS Selector
 * @returns {${wrapperName} | null}
 */
find${name}(selector?: string): ${wrapperName} | null;

/**
 * Returns an array of ${name} wrapper that matches the specified CSS selector.
 * If no CSS selector is specified, returns all of the ${pluralName} inside the current wrapper.
 * If no matching ${name} is found, returns an empty array.
 *
 * @param {string} [selector] CSS Selector
 * @returns {Array<${wrapperName}>}
 */
findAll${pluralName}(selector?: string): Array<${wrapperName}>;`,

  selectors: ({ name, pluralName, wrapperName }: ComponentWrapperMetadata) => `
/**
 * Returns a wrapper that matches the ${pluralName} with the specified CSS selector.
 * If no CSS selector is specified, returns a wrapper that matches ${pluralName}.
 *
 * @param {string} [selector] CSS Selector
 * @returns {${wrapperName}}
 */
find${name}(selector?: string): ${wrapperName};

/**
 * Returns a multi-element wrapper that matches ${pluralName} with the specified CSS selector.
 * If no CSS selector is specified, returns a multi-element wrapper that matches ${pluralName}.
 *
 * @param {string} [selector] CSS Selector
 * @returns {MultiElementWrapper<${wrapperName}>}
 */
findAll${pluralName}(selector?: string): MultiElementWrapper<${wrapperName}>;`,
};

const defaultExport = {
  dom: `
export default function wrapper(root: Element = document.body) {
  if (document && document.body && !document.body.contains(root)) {
    console.warn('[AwsUi] [test-utils] provided element is not part of the document body, interactions may work incorrectly')
  };
  return new ElementWrapper(root);
}`,

  selectors: `
export default function wrapper(root: string = 'body') {
  return new ElementWrapper(root);
}`,
};

export interface GenerateFindersParams {
  components: ComponentWrapperMetadata[];
  testUtilType: TestUtilType;
}

export const generateComponentFinders = ({ components, testUtilType }: GenerateFindersParams) => `
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper } from '@cloudscape-design/test-utils-core/${testUtilType}';
import { appendSelector } from '@cloudscape-design/test-utils-core/utils';

export { ElementWrapper };
${components.map(componentWrapperImport).join('')}

${components.map(componentWrapperExport).join('')}

declare module '@cloudscape-design/test-utils-core/dist/${testUtilType}' {
   interface ElementWrapper {
    ${components.map(componentFindersInterfaces[testUtilType]).join('')}
   }
}

${components.map(componentFinders).join('')}

${defaultExport[testUtilType]}
`;
