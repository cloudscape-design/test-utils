#!/usr/bin/env node
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const path = require('path');
const fs = require('fs');

const root = path.join(__dirname, '..');
const original = path.join(root, 'package.json');
const originalContent = JSON.parse(fs.readFileSync(original).toString());

const packages = [
  {
    manifest: {
      name: '@cloudscape-design/test-utils-converter',
      main: './dist/index.js',
      files: ['dist', 'NOTICE', 'LICENSE', 'README.md'],
    },
    packageRoot: path.join(root, './lib/converter'),
    dependencies: ['@babel/core', '@babel/plugin-syntax-decorators', '@babel/plugin-syntax-typescript', 'glob'],
  },
  {
    manifest: {
      name: '@cloudscape-design/test-utils-core',
      files: ['test-utils-doc', 'dist', '*.js', '*.d.ts', 'NOTICE', 'LICENSE', 'README.md'],
    },
    packageRoot: path.join(root, './lib/core'),
    dependencies: ['css-selector-tokenizer', 'css.escape'],
  },
];

packages.forEach(package => {
  const { packageRoot, dependencies, manifest } = package;
  const { version } = originalContent;

  const pkg = {
    version,
    license: originalContent.license,
    homepage: originalContent.homepage,
    repository: originalContent.repository,
    ...manifest,
    dependencies: pickDependenciesWithVersions(dependencies, originalContent.dependencies),
  };
  fs.writeFileSync(path.join(packageRoot, './package.json'), JSON.stringify(pkg, null, 2));
});

function pickDependenciesWithVersions(dependencies, options) {
  return dependencies.reduce((obj, dep) => {
    const version = options[dep];
    if (!version) {
      throw new Error(`Dependency ${dep} is not listed in package.json but required by package`);
    }
    obj[dep] = version;
    return obj;
  }, {});
}
