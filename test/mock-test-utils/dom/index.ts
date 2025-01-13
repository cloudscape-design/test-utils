// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import { appendSelector } from '@cloudscape-design/test-utils-core/utils';

export { ElementWrapper };

import AlertWrapper from './../test-utils';
import StatusWrapper from './../test-utils';

export { AlertWrapper };
export { StatusWrapper };

declare module '@cloudscape-design/test-utils-core/dist/dom' {
  interface ElementWrapper {
    /**
     * Returns the wrapper of the first Alert that matches the specified CSS selector.
     * If no CSS selector is specified, returns the wrapper of the first Alert.
     * If no matching Alert is found, returns `null`.
     *
     * @param {string} [selector] CSS Selector
     * @returns {AlertWrapper | null}
     */
    findAlert(selector?: string): AlertWrapper | null;

    /**
     * Returns an array of Alert wrapper that matches the specified CSS selector.
     * If no CSS selector is specified, returns all of the Alerts inside the current wrapper.
     * If no matching Alert is found, returns an empty array.
     *
     * @param {string} [selector] CSS Selector
     * @returns {Array<AlertWrapper>}
     */
    findAllAlerts(selector?: string): Array<AlertWrapper>;
    /**
     * Returns the wrapper of the first Status that matches the specified CSS selector.
     * If no CSS selector is specified, returns the wrapper of the first Status.
     * If no matching Status is found, returns `null`.
     *
     * @param {string} [selector] CSS Selector
     * @returns {StatusWrapper | null}
     */
    findStatus(selector?: string): StatusWrapper | null;

    /**
     * Returns an array of Status wrapper that matches the specified CSS selector.
     * If no CSS selector is specified, returns all of the Status inside the current wrapper.
     * If no matching Status is found, returns an empty array.
     *
     * @param {string} [selector] CSS Selector
     * @returns {Array<StatusWrapper>}
     */
    findAllStatus(selector?: string): Array<StatusWrapper>;
  }
}

ElementWrapper.prototype.findAlert = function (selector) {
  const rootSelector = `.${AlertWrapper.rootSelector}`;
  // casting to 'any' is needed to avoid this issue with generics
  // https://github.com/microsoft/TypeScript/issues/29132
  return (this as any).findComponent(selector ? appendSelector(selector, rootSelector) : rootSelector, AlertWrapper);
};

ElementWrapper.prototype.findAllAlerts = function (selector) {
  return this.findAllComponents(AlertWrapper, selector);
};
ElementWrapper.prototype.findStatus = function (selector) {
  const rootSelector = `.${StatusWrapper.rootSelector}`;
  // casting to 'any' is needed to avoid this issue with generics
  // https://github.com/microsoft/TypeScript/issues/29132
  return (this as any).findComponent(selector ? appendSelector(selector, rootSelector) : rootSelector, StatusWrapper);
};

ElementWrapper.prototype.findAllStatus = function (selector) {
  return this.findAllComponents(StatusWrapper, selector);
};

/**
 * Returns the component metadata including its plural and wrapper name.
 *
 * @param {string} componentName Component name in pascal case.
 * @returns {ComponentMetadata}
 */
export function getComponentMetadata(componentName: string) {
  return {
    Alert: { pluralName: 'Alerts', wrapperName: 'AlertWrapper' },
    Status: { pluralName: 'Status', wrapperName: 'StatusWrapper' },
  }[componentName];
}

export default function wrapper(root: Element = document.body) {
  if (document && document.body && !document.body.contains(root)) {
    console.warn(
      '[AwsUi] [test-utils] provided element is not part of the document body, interactions may work incorrectly'
    );
  }
  return new ElementWrapper(root);
}
