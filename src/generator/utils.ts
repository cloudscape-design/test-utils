// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentMetadata, ComponentPublicMetadataMap } from './interfaces';

export function buildComponentsMetadataMap(components: ComponentMetadata[]): string {
  const componentMetadata: ComponentPublicMetadataMap = {};

  for (const { name, pluralName, wrapperName } of components) {
    componentMetadata[name] = {
      pluralName,
      wrapperName,
    };
  }

  return JSON.stringify(componentMetadata);
}
