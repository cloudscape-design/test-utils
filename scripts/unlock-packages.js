#!/usr/bin/env node
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const fs = require('fs');

/**
 * Remove specific @cloudscape-design/* packages where we should always use the latest minor release
 */
[
  require.resolve('../package-lock.json'),
  require.resolve('../packages/converter/package-lock.json'),
  require.resolve('../packages/core/package-lock.json')
].forEach(filename => unlock(filename));

function unlock(filename) {
  const packageLock = require(filename);
  Object.keys(packageLock.dependencies).forEach(dependency => {
    if (dependency.startsWith('@cloudscape-design/')) {
      delete packageLock.dependencies[dependency];
    }
  });
  fs.writeFileSync(filename, JSON.stringify(packageLock, null, 2) + '\n');
  console.log(`Removed @cloudscape-design/ dependencies from ${filename} file`);
}
