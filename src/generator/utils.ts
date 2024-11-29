// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import fs from 'fs';
import path from 'path';
import { ComponentPublicMetadata, ComponentWrapperMetadata } from './interfaces';
import { execaSync } from 'execa';

export function buildComponentsMetadataMap(components: ComponentWrapperMetadata[]): string {
  const componentPublicMetadata: Record<string, ComponentPublicMetadata> = {};

  for (const { name, pluralName, wrapperName } of components) {
    componentPublicMetadata[name] = {
      pluralName,
      wrapperName,
    };
  }

  return JSON.stringify(componentPublicMetadata);
}

export function writeSourceFile(filepath: string, content: string) {
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, content);
}

export function compileTypescript() {
  const config = path.resolve('./tsconfig.compiler.json');
  execaSync('tsc', ['-p', config, '--sourceMap', '--inlineSources'], { stdio: 'inherit' });
}
