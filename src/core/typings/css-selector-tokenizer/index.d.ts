// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
declare module 'css-selector-tokenizer' {
  namespace Tokenizer {
    export interface Token {
      type: string;
      name: string;
    }

    export interface Selector {
      type: 'selector';
      nodes: Array<Token>;
    }

    export interface SelectorsTree {
      type: 'selectors';
      nodes: Array<Selector>;
    }
  }

  const Tokenizer: {
    parse: (input: string) => Tokenizer.SelectorsTree;
    stringify: (tree: Tokenizer.SelectorsTree) => string;
  };
  export = Tokenizer;
}
