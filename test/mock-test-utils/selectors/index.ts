// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper } from '@cloudscape-design/test-utils-core/selectors';
import { appendSelector } from '@cloudscape-design/test-utils-core/utils';

export { ElementWrapper };

import AlertWrapper from './../test-utils';
import StatusWrapper from './../test-utils';

export { AlertWrapper };
export { StatusWrapper };

declare module '@cloudscape-design/test-utils-core/dist/selectors' {
  interface ElementWrapper {
    /**
     * Returns a wrapper that matches the Alerts with the specified CSS selector.
     * If no CSS selector is specified, returns a wrapper that matches Alerts.
     *
     * @param {string} [selector] CSS Selector
     * @returns {AlertWrapper}
     */
    findAlert(selector?: string): AlertWrapper;

    /**
     * Returns a multi-element wrapper that matches Alerts with the specified CSS selector.
     * If no CSS selector is specified, returns a multi-element wrapper that matches Alerts.
     *
     * @param {string} [selector] CSS Selector
     * @returns {MultiElementWrapper<AlertWrapper>}
     */
    findAllAlerts(selector?: string): MultiElementWrapper<AlertWrapper>;
    /**
     * Returns a wrapper that matches the Status with the specified CSS selector.
     * If no CSS selector is specified, returns a wrapper that matches Status.
     *
     * @param {string} [selector] CSS Selector
     * @returns {StatusWrapper}
     */
    findStatus(selector?: string): StatusWrapper;

    /**
     * Returns a multi-element wrapper that matches Status with the specified CSS selector.
     * If no CSS selector is specified, returns a multi-element wrapper that matches Status.
     *
     * @param {string} [selector] CSS Selector
     * @returns {MultiElementWrapper<StatusWrapper>}
     */
    findAllStatus(selector?: string): MultiElementWrapper<StatusWrapper>;
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

export default function wrapper(root = 'body') {
  return new ElementWrapper(root);
}
