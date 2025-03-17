// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      enabled: process.env.CI === 'true',
      provider: 'istanbul',
      include: ['src/**'],
      exclude: ['**/debug-tools/**', '**/test/**'],
    },
  },
  resolve: {
    alias: {
      '@cloudscape-design/test-utils-core': path.resolve(__dirname, './lib/core'),
    },
  },
});
