import { ApolloClient, ApolloLink, concat, createHttpLink, InMemoryCache, split } from '@apollo/client';
import { createClient as createWsClient } from "graphql-ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions"
import { getAccessToken } from '../auth';
import { getMainDefinition } from '@apollo/client/utilities';
import { Kind, OperationTypeNode } from 'graphql';

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
  }
  return forward(operation);
});

const httpLink = concat(authLink, createHttpLink({ uri: 'http://localhost:9000/graphql' }));

const wsLink = new GraphQLWsLink(createWsClient({
  url: "ws://localhost:9000/graphql"
}));

export const apolloClient = new ApolloClient({
  link: split(isSubscription, wsLink, httpLink),
  cache: new InMemoryCache(isSubscription, wsLink, httpLink),
});

function isSubscription(operation) {
  const definition = getMainDefinition(operation.query);
  return definition.kind === Kind.OPERATION_TYPE_DEFINITION && definition.operation === OperationTypeNode.SUBSCRIPTION;
}