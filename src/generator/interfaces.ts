// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export type TestUtilType = 'dom' | 'selectors';

export interface ComponentMetadata {
  /**
   * Name of the component in pascal case.
   * Examples: Button, Alert, ButtonDropdown
   */
  name: string;

  /**
   * Plural name of the component in pascal case.
   * Examples: Buttons, Alerts, ButtonDropdowns
   */
  pluralName: string;

  /**
   * Test utils wrapper name of the component in pascal case.
   * Examples: ButtonWrapper, AlertWrapper, ButtonDropdownWrapper
   */
  wrapperName: string;

  /**
   * Path to import the test utils wrapper.
   */
  wrapperImportPath: string;
}

export type ComponentPublicMetadata = Pick<ComponentMetadata, 'pluralName' | 'wrapperName'>;
export type ComponentPublicMetadataMap = Record<string, ComponentPublicMetadata>;

export interface GenerateFindersParams {
  /**
   * List of the components that test utils will be generated for.
   */
  components: ComponentMetadata[];

  /**
   * Target test utils type. The values can be `dom` or `selectors`.
   */
  testUtilType: TestUtilType;

  /**
   * Extra imports to be added to the generated file head.
   */
  extraImports?: string[];
}
