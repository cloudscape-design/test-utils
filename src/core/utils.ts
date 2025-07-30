// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/*eslint-env browser*/
import * as Tokenizer from 'css-selector-tokenizer';
import 'css.escape';

export const escapeSelector = (value: string): string => {
  return CSS.escape(value);
};

const SCOPE_REGEX = /:scope/gi;

export const isScopedSelector = (selector: string): boolean => {
  return SCOPE_REGEX.test(selector);
};

export const substituteScope = (selector: string, scope: string): string => {
  return selector.replace(SCOPE_REGEX, scope);
};

function validateSelector(selector: string, tree: Tokenizer.SelectorsTree) {
  if (tree.nodes.length > 1) {
    throw new Error(`Multi-selector strings are not supported, got: "${selector}"`);
  }
}

function findInsertionIndex(tokens: Array<Tokenizer.Token>) {
  const pseudoSelectors = ['pseudo-class', 'pseudo-element', 'nested-pseudo-class'];
  for (let i = 0; i < tokens.length; i++) {
    if (pseudoSelectors.indexOf(tokens[i].type) > -1) {
      return i;
    }
  }
  return tokens.length;
}

export function appendSelector(selector: string, suffix: string) {
  const tree = Tokenizer.parse(selector);
  validateSelector(selector, tree);
  const suffixTree = Tokenizer.parse(suffix);
  validateSelector(suffix, suffixTree);
  const combinator = suffixTree.nodes[0].nodes.filter(node => node.type === 'operator' || node.type === 'spacing');
  if (combinator.length > 0) {
    throw new Error(`Appended selector may not contain a combinator, got "${suffix}"`);
  }

  tree.nodes[0].nodes.splice(findInsertionIndex(tree.nodes[0].nodes), 0, ...suffixTree.nodes[0].nodes);
  return Tokenizer.stringify(tree);
}

const trimContentHash = (className: string): string => {
  const splitSelector = className.replace('.', '').split('_');
  if (splitSelector.length >= 5) {
    splitSelector.splice(splitSelector.length - 2, splitSelector.length);
    const baseClassName = splitSelector.join('_');

    return `[class*="${baseClassName}"]`;
  }
  return className;
};

export const getUnscopedClassName = (selector: string): string => {
  // this regexp resembles the logic of this code in the theming-core package:
  // see src/build/tasks/postcss/generate-scoped-name.ts
  return selector.replace(/\.awsui_[a-zA-Z0-9_-]+/g, match => {
    return trimContentHash(match);
  });
};

export enum KeyCode {
  pageUp = 33,
  pageDown = 34,
  end = 35,
  home = 36,
  space = 32,
  down = 40,
  left = 37,
  right = 39,
  up = 38,
  escape = 27,
  enter = 13,
  tab = 9,
  shift = 16,
  backspace = 8,
  control = 17,
  alt = 18,
  meta = 91,
}

export type Comparator = string | RegExp | ((name: string) => boolean);

export function createComparator(comparator: Comparator) {
  switch (typeof comparator) {
    case 'string':
      return (subject: string) => subject === comparator;
    case 'function':
      return comparator;
  }
  if (comparator instanceof RegExp) {
    return (subject: string) => comparator.exec(subject);
  }
  throw new Error(`Invalid condition provided: ${comparator}`);
}
