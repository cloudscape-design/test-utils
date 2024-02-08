// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      enabled: process.env.CI === 'true',
      provider: 'istanbul',
      include: ['packages/**/src/**'],
      exclude: ['**/debug-tools/**', '**/test/**'],
    },
  },
});
