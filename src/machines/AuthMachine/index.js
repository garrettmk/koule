import auth0 from 'auth0-js';
import { Machine, sendParent, assign, spawn } from "xstate";

let webAuth = null;

export const AuthMachine = Machine({
  id: 'auth-machine',
  context: {},
  initial: 'initializing',
  states: {
    initializing: {
      initial: 'creating',
      states: {
        creating: {
          entry: 'createWebAuth',
          on: {
            '': 'checkingCallback'
          }
        },
        checkingCallback: {
          on: {
            '': [
              {
                cond: 'isCallbackUrl',
                target: '#auth-machine.authenticating'
              },
              {
                target: 'checkingSession'
              }
            ]
          },
        },
        checkingSession: {
          invoke: {
            id: 'check-session',
            src: 'checkSessionService',
            onDone: '#auth-machine.signedIn',
            onError: '#auth-machine.signedOut'
          }
        }
      },
    },
    signedOut: {
      on: {
        SIGN_IN: { actions: 'authorize' },
      },
      invoke: {
        id: 'check-session-service',
        src: 'checkSessionService',
        onDone: {
          actions: 'assignResult',
          target: 'signedIn'
        },
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
      entry: ['sendSignedIn', 'sendIdToken'],
      initial: 'idle',
      states: {
        idle: {
          on: {
            GET_ID_TOKEN: 'gettingToken'
          }
        },
        gettingToken: {
          invoke: {
            id: 'tokenGetter',
            src: 'checkSessionService',
            onDone: {
              target: 'idle',
              actions: ['assignResult', 'sendIdToken']
            },
            onError: {
              actions: 'authorize'
            }
          }
        }
      },
      on: {
        SIGN_OUT: { actions: 'sendSignedOut', target: 'signedOut' },
      }
    }
  }
},{
  actions: {
    createWebAuth: ({ config }) => webAuth = new auth0.WebAuth(config),

    authorize: () => webAuth.authorize(),

    assignResult: assign((_, { data }) => data),

    sendAuthenticating: sendParent('AUTHENTICATING'),

    sendSignedIn: sendParent('SIGNED_IN'),

    sendSignedOut: sendParent('SIGNED_OUT'),

    sendIdToken: sendParent((_, { data }) => ({
      type: 'ID_TOKEN',
      value: data.idToken
    })),
  },

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
});