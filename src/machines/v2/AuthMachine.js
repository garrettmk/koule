import auth0 from 'auth0-js';
import authConfig from '../../config/auth';
import { Machine, assign, sendParent } from "xstate";
import { respond } from "xstate/lib/actions";

let webAuth = new auth0.WebAuth(authConfig);

export const AuthMachine = Machine({
  id: 'auth-machine',
  initial: 'initializing',
  context: {},
  states: {
    initializing: {
      on: {
        '': {
          cond: 'isCallbackUrl',
          target: 'authenticating'
        }
      },
      invoke: {
        src: 'checkSessionService',
        onDone: 'signedIn',
        onError: 'signedOut'
      }
    },
    authenticating: {
      invoke: {
        src: 'parseHashService',
        onDone: 'signedIn',
        onError: 'signedOut'
      }
    },
    signedIn: {
      entry: [
        'assignAuthResult',
        sendParent('SIGNED_IN'),
      ],
      on: {
        SIGN_OUT: 'signedOut',
        GET_ID_TOKEN: { actions: 'respondWithIdToken' }
      }
    },
    signedOut: {
      entry: [
        'assignAuthError',
        sendParent('SIGNED_OUT'),
      ],
      on: {
        SIGN_IN: {
          actions: 'authorize'
        }
      }
    },
  },
},{
  actions: {
    authorize: () => webAuth.authorize(),

    assignAuthResult: assign((_, event) => event.data),

    assignAuthError: assign((_, event) => event.data),

    // respondWithIdToken: sendParent('ID_TOKEN'),
    respondWithIdToken: respond(context => ({
      type: 'ID_TOKEN',
      value: context.idToken
    })),
  },

  services: {
    checkSessionService: () => new Promise((resolve, reject) => {
      webAuth.checkSession({}, (error, authResult) => {
        if (error) reject(error);
        resolve(authResult);
      });
    }),

    parseHashService: () => new Promise((resolve, reject) => {
      webAuth.parseHash((error, authResult) => {
        if (error) reject(error);
        resolve(authResult);
      });
    }),
  },

  guards: {
    isCallbackUrl: () => {
      const location = window.location;
      const isCallback = location && location.pathname.startsWith('/callback');
      const hasResult = location && /access_token|id_token|error/.test(location.hash);

      return isCallback && hasResult;
    },
  }
});