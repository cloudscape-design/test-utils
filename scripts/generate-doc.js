#!/usr/bin/env node
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { writeTestUtilsDocumentation } = require('@cloudscape-design/documenter');

writeTestUtilsDocumentation({
  outDir: './lib/core/test-utils-doc',
  tsconfigPath: require.resolve('../tsconfig.docs.json'),
  domUtils: { root: 'src/core/dom.ts', extraExports: ['createWrapper', 'usesDom'] },
  selectorsUtils: { root: 'src/core/selectors.ts', extraExports: ['createWrapper'] },
});
