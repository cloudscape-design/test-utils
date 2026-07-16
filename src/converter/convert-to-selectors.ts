// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { transformSync, types, PluginObj, NodePath } from '@babel/core';

const runtimeSelectorsPath = '@cloudscape-design/test-utils-core/selectors';
const ourWrappers = ['ElementWrapper', 'ComponentWrapper'];
const domUtilsPath = '@cloudscape-design/test-utils-core/utils-dom';

interface PluginArguments {
  types: typeof types;
}

// Rewrites a `@cloudscape-design/.../dom` module path to `.../selectors`.
function rewriteDomSourceToSelectors(source: NodePath<types.StringLiteral>, t: typeof types) {
  const value = source.node.value;
  if (value.startsWith('@cloudscape-design/')) {
    source.replaceWith(t.stringLiteral(value.replace(/\b\/dom\b/, '/selectors')));
  }
}

function selectorUtilsGenerator({ types: t }: PluginArguments): PluginObj {
  return {
    visitor: {
      ImportDeclaration(path: NodePath<types.ImportDeclaration>) {
        const source = path.get('source');

        // Rewrite import path @cloudscape-design/.../dom -> @cloudscape-design/.../selectors
        rewriteDomSourceToSelectors(source, t);

        // Remove @usesDom decorator
        if (source.node.value === runtimeSelectorsPath) {
          path
            .get('specifiers')
            .filter(spec => spec.node.local.name === 'usesDom')
            .forEach(spec => spec.remove());
        }

        // Remove dom utils
        if (source.node.value === domUtilsPath) {
          path.remove();
        }
      },
      // Re-exports need the same rewrite as imports. Local exports have no source.
      ExportNamedDeclaration(path: NodePath<types.ExportNamedDeclaration>) {
        if (path.node.source) {
          rewriteDomSourceToSelectors(path.get('source') as NodePath<types.StringLiteral>, t);
        }
      },
      ExportAllDeclaration(path: NodePath<types.ExportAllDeclaration>) {
        rewriteDomSourceToSelectors(path.get('source'), t);
      },
      ClassDeclaration(path: NodePath<types.ClassDeclaration>) {
        // our wrapper classes have generic parameters only in DOM version
        if (ourWrappers.includes((path.node.superClass as any)?.name) && path.node.superTypeParameters) {
          path.node.superTypeParameters = null;
        }
      },
      ClassMethod(path: NodePath<types.ClassMethod>) {
        const decorators = path.node.decorators;
        // remove methods marked with @usesDom decorator
        if (decorators) {
          const domDecorator = decorators.find(
            dec => t.isIdentifier(dec.expression) && dec.expression.name === 'usesDom',
          );
          if (domDecorator) {
            path.remove();
            return;
          }
        }

        // Remove explicit return types, let Typescript infer them
        path.get('returnType').remove();
      },
      TSTypeParameterInstantiation(path: NodePath<types.TSTypeParameterInstantiation>) {
        // Remove all DOM-types, they are not needed in selectors
        const containsDomElement = path.node.params.some(
          param =>
            param.type === 'TSTypeReference' &&
            param.typeName.type === 'Identifier' &&
            param.typeName.name.startsWith('HTML'),
        );
        if (containsDomElement) {
          path.remove();
        }
      },
    },
  };
}

export function convertToSelectorUtil(source: string) {
  return transformSync(source, {
    babelrc: false,
    configFile: false,
    plugins: [
      require('@babel/plugin-syntax-typescript'),
      [require('@babel/plugin-syntax-decorators'), { legacy: true }],
      selectorUtilsGenerator,
    ],
  })?.code;
}
