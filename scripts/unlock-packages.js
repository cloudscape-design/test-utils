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
  require.resolve('../packages/core/package-lock.json'),
].forEach(filename => unlock(filename));

function removeDependencies(dependencyName, packages) {
  if (dependencyName.includes('@cloudscape-design/')) {
    delete packages[dependencyName];
  }
}

function unlock(filename) {
  const packageLock = require(filename);
  Object.keys(packageLock.packages).forEach(dependencyName => {
    removeDependencies(dependencyName, packageLock.packages);
  });

  Object.keys(packageLock.dependencies).forEach(dependencyName => {
    removeDependencies(dependencyName, packageLock.dependencies);
  });

  fs.writeFileSync(filename, JSON.stringify(packageLock, null, 2) + '\n');
  console.log(`Removed @cloudscape-design/ dependencies from ${filename} file`);
}
