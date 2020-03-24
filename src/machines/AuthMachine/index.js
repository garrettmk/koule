import auth0 from 'auth0-js';
import { Machine, sendParent, assign, spawn } from "xstate";

let webAuth = null;

export const AuthMachine = Machine({
  id: 'auth-machine',
  context: {
    result: null,
    tokenGetter: null,
  },
  initial: 'initializing',
  states: {
    initializing: {
      entry: 'createWebAuth',
      on: {
        '': {
          cond: 'isCallbackUrl',
          target: 'authenticating'
        },
      },
      invoke: {
        id: 'check-session-service',
        src: 'checkSessionService',
        onDone: {
          actions: 'assignResult',
          target: 'signedIn'
        },
        onError: {
          target: 'signedOut'
        }
      }
    },
    signedOut: {
      entry: 'sendSignedOut',
      on: {
        SIGN_IN: { actions: 'authorize' },
      }
    },
    authenticating: {
      entry: 'sendAuthenticating',
      invoke: {
        id: 'handle-callback-service',
        src: 'parseCallbackService',
        onDone: {
          actions: 'assignResult',
          target: 'signedIn'
        },
        onError: {
          actions: 'assignResult',
          target: 'signedOut'
        }
      }
    },
    signedIn: {
      entry: 'sendSignedIn',
      on: {
        SIGN_OUT: { actions: 'sendSignedOut', target: 'signedOut' },
        GET_ID_TOKEN: { actions: 'spawnTokenGetter' },
        'done.invoke.get-token': { actions: 'respondWithToken' },
      }
    }
  }
},{
  guards: {
    isCallbackUrl: () => {
      const location = window.location;
      const isCallback = location && location.pathname.startsWith('/callback');
      const hasResult = location && /access_token|id_token|error/.test(location.hash);

      return isCallback && hasResult;
    }
  },

  services: {
    checkSessionService: () => new Promise((resolve, reject) => {
      webAuth.checkSession({}, (error, authResult) => {
        if (error) reject(error);

        resolve(authResult);
      });
    }),

    parseCallbackService: () => new Promise((resolve, reject) => {
      webAuth.parseHash((error, authResult) => {
        if (error) reject(error);

        window.history.replaceState(null, '', '/');

        resolve(authResult);
      });
    }),
  },

  actions: {
    createWebAuth: ({ config }) => webAuth = new auth0.WebAuth(config),

    authorize: () => {
      webAuth.authorize()
    },

    assignResult: assign({
      result: (_, event) => event.data
    }),

    sendAuthenticating: sendParent('AUTHENTICATING'),

    sendSignedIn: sendParent('SIGNED_IN'),

    sendSignedOut: sendParent('SIGNED_OUT'),

    spawnTokenGetter: assign({
      tokenGetter: ({ result }) => spawn(
        new Promise((resolve, reject) => resolve(result.idToken)),
        'get-token'
      )
    }),

    respondWithToken: sendParent((_, { data }) => ({ type: 'ID_TOKEN', value: data }))
  }
});