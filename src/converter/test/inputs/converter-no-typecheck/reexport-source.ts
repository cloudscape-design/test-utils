// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Proxied wrappers are often written as re-exports, so the `/dom` -> `/selectors`
// rewrite has to apply to re-export sources too, not just imports.
export { default } from '@cloudscape-design/components/test-utils/dom/button';
export * from '@cloudscape-design/components/test-utils/dom/container';

// Local exports have no module source, so they stay as-is.
const value = 1;
export { value };
export default value;
