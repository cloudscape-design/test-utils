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
   * Folder name of the component test utils.
   * If not specified, the kebab case of the component name will be used by default.
   */
  testUtilsFolderName?: string;
}

export interface GenerateTestUtilsParams {
  /**
   * List of components metadata to generate test utils.
   */
  components: ComponentMetadata[];

  /*
   * Absolute path to the test utils folder.
   *
   * Component wrappers will be loaded from this path.
   * Generated test utils will be stored in this folder.
   *
   * Expected file name format is kebab case.
   *
   */
  testUtilsPath: string;

  /**
   * Custom namespace for the ElementWrapper module augmentation and import.
   * When provided, the generated index files will import ElementWrapper from the custom namespace
   * and augment it instead of the default @cloudscape-design/test-utils-core namespace.
   * This allows custom component libraries to declare an isolated ElementWrapper that does not
   * inherit augmentations from @cloudscape-design/components.
   */
  namespace?: {
    dom: string;
    selectors: string;
  };
}

export interface ComponentWrapperMetadata extends ComponentMetadata {
  /*
   * Name of the component wrapper in pascal case
   * Examples: ButtonWrapper, AlertWrapper, ButtonDropdownWrapper
   */
  wrapperName: string;

  /**
   * Relative path to import the wrapper.
   */
  wrapperImportPath: string;
}
