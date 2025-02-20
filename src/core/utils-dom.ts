// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Use this file for any utilities specific to React/ReactDOM APIs or those that depend on them.

import * as React from 'react';
import { act as reactDomAct } from 'react-dom/test-utils';

export const act = ('act' in React ? React.act : reactDomAct) as typeof reactDomAct;

// Original Copyright 2017-Present Kent C. Dodds. Licensed under MIT License.
// Testing Library code

/* istanbul ignore next @preserve */
export function setNativeValue(element: Element, value: string): void {
  const { set: valueSetter } = Object.getOwnPropertyDescriptor(element, 'value') || {};
  const prototype = Object.getPrototypeOf(element);
  const { set: prototypeValueSetter } = Object.getOwnPropertyDescriptor(prototype, 'value') || {};

  if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value);
  } else {
    if (valueSetter) {
      valueSetter.call(element, value);
    } else {
      throw new Error('The given element does not have a value setter');
    }
  }
}

// End of Testing Library code
