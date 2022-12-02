#!/usr/bin/env node
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// This file converts example input into selector utils and checks that the result compiles by Typescript
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const convertToSelectorUtil = require('..').default;

const inputDir = path.join(__dirname, '../test/inputs');
const outputDir = path.join(__dirname, '../test/outputs');

if (fs.rmSync) {
  // node 14+
  fs.rmSync(outputDir, { recursive: true, force: true });
} else {
  // node 12. deprecated
  fs.rmdirSync(outputDir, { recursive: true });
}
fs.mkdirSync(outputDir, { recursive: true });
fs.readdirSync(inputDir).forEach(name => {
  const source = fs.readFileSync(path.join(inputDir, name), 'utf-8').trim();
  const result = convertToSelectorUtil(source);
  fs.writeFileSync(path.join(outputDir, name), result);
});

// Command-line API does not allow to use tsconfig when compiling only selected files
// https://github.com/microsoft/TypeScript/issues/27379
execSync('tsc --noEmit --strict --experimentalDecorators --target es5 test/inputs/*.ts test/outputs/*.ts', {
  stdio: 'inherit',
});
