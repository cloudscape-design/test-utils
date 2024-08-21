// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export interface IElementWrapper<ElementType, CollectionType> {
  getElement(): ElementType;

  matches(selector: string): IElementWrapper<ElementType, CollectionType> | null;

  find(selector: string): IElementWrapper<ElementType, CollectionType> | null;

  findAll(selector: string, options?: MultiElementWrapperOptions): CollectionType;
}

export interface MultiElementWrapperOptions {
  useTestindex?: boolean;
}
