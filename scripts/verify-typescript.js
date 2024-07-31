#!/usr/bin/env node
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// This file converts example input into selector utils and checks that the result compiles by Typescript
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const { execSync } = require('child_process');
const convertToSelectorUtil = require(path.join(__dirname, '../lib/converter/dist')).default;

// These test files include utils represented as external dependencies to properly test their conversion to selectors.
// We need to skip them here because they are not expected to compile correctly.
const skip = ['strip-external-imports.ts'];

const inputDir = path.join(__dirname, '../src/converter/test/inputs/converter');
const outputDir = path.join(__dirname, '../src/converter/test/outputs/converter');

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });
fs.readdirSync(inputDir).forEach(name => {
  if (skip.includes(name)) {
    return;
  }

  const source = fs.readFileSync(path.join(inputDir, name), 'utf-8').trim();
  const result = convertToSelectorUtil(source);
  fs.writeFileSync(path.join(outputDir, name), result);
});

const includedInputFiles = glob.sync('src/converter/test/inputs/converter/*.ts').filter(file => {
  const fileName = file.split('/').pop();
  return !skip.includes(fileName);
});

// Command-line API does not allow to use tsconfig when compiling only selected files
// https://github.com/microsoft/TypeScript/issues/27379
execSync(
  `tsc --noEmit --strict --experimentalDecorators --target es5 ${includedInputFiles.join(
    ' '
  )} src/converter/test/outputs/converter/*.ts`,
  {
    stdio: 'inherit',
  }
);
