// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Use this file for any utilities specific to React/ReactDOM APIs or those that depend on them.

import * as React from 'react';
import { act as reactDomAct } from 'react-dom/test-utils';

export const act = ('act' in React ? React.act : reactDomAct) as typeof reactDomAct;
