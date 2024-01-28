import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { ExecutionResult, graphql, print } from 'graphql';

import type { AppContext } from '../../src/contract/Type.js';
import { schema } from '../../src/graphql/schema.js';


export function run<TResult, TVariables>(
  query: TypedDocumentNode<TResult, TVariables>,
  context: AppContext,
  variables?: TVariables extends Record<string, never> ? undefined : TVariables
): Promise<ExecutionResult<TResult>> {

  return graphql({
    schema,
    source: print(query),
    contextValue: context,
    variableValues: variables ?? undefined
  }) as Promise<ExecutionResult<TResult>>;
}
