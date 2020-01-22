import auth0 from "auth0-js";
import authConfig from "../config/auth";
import { assign, send } from "xstate";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { getMainDefinition } from "apollo-utilities";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { split } from 'apollo-link';

let webAuth = new auth0.WebAuth(authConfig);

function isCallbackUrl() {
  const location = window.location;
  const isCallback = location && location.pathname.startsWith('/callback');
  const hasResult = location && /access_token|id_token|error/.test(location.hash);

  return isCallback && hasResult;
}

export default {
  context: {
    auth: null,
    apollo: null,
  },

  states: {
    auth: {
      initial: 'signedOut',
      states: {
        signedOut: {
          on: {
            '': { cond: 'isCallbackUrl', target: 'authenticating' },
            SIGN_IN: 'authenticating'
          }
        },
        authenticating: {
          invoke: {
            id: 'auth-service',
            src: 'authService',
            onDone: [
              { cond: 'isLoginPending' },
              { target: 'signedIn' }
            ],
            onError: [
              { cond: 'isLoginRequiredError', target: 'authenticating', internal: false },
              { target: 'signedOut', actions: 'logAuthError' }
            ]
          }
        },
        signedIn: {
          entry: [
            'assignAuthResult',
            'initializeApollo',
            send('SIGNED_IN')
          ],
          on: {
            SIGN_OUT: { target: 'signedOut', actions: 'signOut' }
          }
        }
      }
    }
  },

  actions: {
    assignAuthResult: assign({
      auth: (_, { data }) => data,
    }),

    logAuthError: (_, event) => console.log(event),

    initializeApollo: assign({
      apollo: ({ auth }) => {
        const httpLink = new HttpLink({
          uri: 'http://koule-api.herokuapp.com/v1/graphql',
          headers: { Authorization: 'Bearer ' + auth.idToken },
        });

        const wsLink = new WebSocketLink(
          new SubscriptionClient('ws://koule-api.herokuapp.com/v1/graphql', {
            options: { reconnect: true },
            connectionParams: {
              headers: {
                Authorization: 'Bearer ' + auth.idToken
              }
            }
          }));

        const link = split(
          ({ query }) => {
            const { kind, operation } = getMainDefinition(query);
            return kind === 'OperationDefinition' && operation === 'subscription';
          },
          wsLink,
          httpLink
        );

        return new ApolloClient({
          cache: new InMemoryCache(),
          link,
          defaultOptions: { fetchPoliciy: 'network-only' }
        })
      }
    }),

    signOut: assign(context => {
      webAuth.logout();

      return {
        ...context,
        auth: null
      }
    }),
  },

  services: {
    authService: (_, { loginRequired = true }) => {
      if (isCallbackUrl())
        return new Promise((resolve, reject) => {
          webAuth.parseHash((err, authResult) => {
            if (err)
              reject(err);

            window.history.replaceState(null, '', '/');

            resolve(authResult);
          })
        });

      if (!loginRequired)
        return new Promise((resolve, reject) => {
          webAuth.checkSession({}, (error, authResult) => {
            if (error)
              reject(error);

            resolve(authResult);
          })
        });

      webAuth.authorize();
      return Promise.resolve('PENDING');
    }
  },

  guards: {
    isCallbackUrl,
    isLoginPending: (_, { data }) => data === 'PENDING',
    isLoginRequiredError: (_, { data }) => data.error === 'login_required',
  }
}
