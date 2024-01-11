// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import fs from 'fs';
import path from 'path';
import convertToSelectorUtil from '../src/index';

const inputDir = path.join(__dirname, 'inputs', 'converter');

fs.readdirSync(inputDir).forEach(name => {
  test(path.basename(name, '.ts'), () => {
    const source = fs.readFileSync(path.join(inputDir, name), 'utf-8').trim();
    const result = convertToSelectorUtil(source);
    expect(result).toMatchSnapshot();
  });
});
