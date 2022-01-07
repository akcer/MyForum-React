import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  from,
  fromPromise,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import axios from 'axios';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_GRAPHQL_HOST,
  credentials: 'include',
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );

      for (let err of graphQLErrors) {
        switch (err?.extensions?.code) {
          case 'UNAUTHENTICATED': {
            return fromPromise(
              axios
                .get(`${process.env.NEXT_PUBLIC_API_HOST}auth/refresh`, {
                  withCredentials: true,
                })
                .then((response: any) => {
                  console.log(`response.data`, response.data);
                  return response;
                })
                .catch((error) => {
                  console.log(`Refresh error`, { error });
                  return error;
                })
            )
              .filter((value) => Boolean(value))
              .flatMap(() => {
                // retry the request, returning the new observable
                return forward(operation);
              });
          }
        }
      }
    }
    if (networkError) console.log(`[Network error]: ${networkError}`);
  }
);

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});
export default client;
