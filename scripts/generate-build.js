// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * This script allows for backwards compatability with the existing release action.
 */
const fs = require('node:fs');
const path = require('node:path');
const glob = require('glob');

const baseDir = path.join(__dirname, '..');
const libFolder = path.join(baseDir, 'lib');
const buildFolder = path.join(baseDir, 'packages');

const pkg = JSON.parse(fs.readFileSync(path.join(baseDir, 'package.json'), 'utf8'));

if (pkg.files && pkg.files.length > 0) {
  for (const filePattern of pkg.files) {
    const files = glob.sync(filePattern);
    for (const file of files) {
      const dest = path.join(buildFolder, file);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.cpSync(file, dest, { recursive: true });
    }
  }

  fs.writeFileSync(path.join(buildFolder, 'package.json'), JSON.stringify({ ...pkg, scripts: {} }, null, 2));
} else {
  fs.cpSync(libFolder, buildFolder, { recursive: true });
}

fs.cpSync(path.join(baseDir, 'README.md'), path.join(buildFolder, 'README.md'));
