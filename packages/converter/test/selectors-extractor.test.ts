// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import path from 'path';
import { extractTestSelectorsUtil } from '../src/index';

const srcPath = path.join(__dirname, 'inputs', 'selectors-extractor', 'src');
const libPath = path.join(__dirname, 'inputs', 'selectors-extractor', 'lib', 'components');

test('selectors-extractor', () => {
  expect(extractTestSelectorsUtil({ srcPath, libPath })).toMatchSnapshot();
});
