#!/usr/bin/env node
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { documentTestUtils } = require('@cloudscape-design/documenter');
const fs = require('node:fs');

const outputPath = './lib/core/test-utils-doc';
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const testUtilTypes = ['dom', 'selectors'];
testUtilTypes.forEach(testUtilType => {
  const wrapperDefinitions = documentTestUtils(
    {
      tsconfig: require.resolve('../tsconfig.docs.json'),
      includeDeclarations: true,
      excludeExternals: true,
    },
    `./lib/core/**/${testUtilType}.d.ts`,
  );

  const fileContent = `module.exports = ${JSON.stringify(wrapperDefinitions)}`;
  fs.writeFileSync(`${outputPath}/${testUtilType}.js`, fileContent);
});
