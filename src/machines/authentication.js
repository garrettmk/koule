import { Machine, assign, sendParent } from 'xstate';
import auth0 from 'auth0-js';
import authConfig from '../config/auth';
import { actions } from "xstate";
const { respond } = actions;


let webAuth = null;

export const config = {
  id: 'authentication',
  context: {},
  initial: 'initializing',
  states: {
    initializing: {
      invoke: {
        id: 'initialize-service',
        src: 'initialize',
        onDone: 'signedOut',
        onError: 'failed',
      }
    },
    signedOut: {
      entry: 'notifySignedOut',
      on: {
        '': { cond: 'isCallbackUrl', target: 'authenticating' },
        SIGN_IN: 'authenticating',
      }
    },
    authenticating: {
      invoke: {
        id: 'auth-service',
        src: 'authenticate',
        onDone: [
          { cond: 'isPending' },
          { target: 'signedIn' }
        ],
        onError: 'failed',
      }
    },
    signedIn: {
      entry: ['assignAuthResult', 'notifySignedIn'],
      on: {
        SIGN_OUT: { target: 'signedOut', actions: 'logout' },
      }
    },
    failed: {
      on: {
        SIGN_IN: 'authenticating'
      }
    }
  }
};

export const options = {
  actions: {
    logout: () => webAuth.logout(),

    notifySignedIn: sendParent((_, e) => ({ type: 'SIGNED_IN', data: e.data })),
    notifySignedOut: sendParent('SIGNED_OUT'),
  },

  services: {
    initialize: async () => webAuth = new auth0.WebAuth(authConfig),

    authenticate: () => {
      if (isCallbackUrl())
        return new Promise((resolve, reject) => {
          webAuth.parseHash((err, authResult) => {
            const {accessToken, idToken} = authResult;
            if (!(accessToken && idToken))
              reject(err);

            window.history.replaceState(null, '', '/');

            resolve(authResult);
          })
        });

      webAuth.authorize();
      return Promise.resolve('PENDING');
    },
  },

  guards: {
    isCallbackUrl,
    isPending: (_, event) => event.data === 'PENDING',
  }
};

function isCallbackUrl() {
  const location = window.location;
  const isCallback = location && location.pathname.startsWith('/callback');
  const hasResult = location && /access_token|id_token|error/.test(location.hash);

  return isCallback && hasResult;
}

export const AuthenticationMachine = Machine(config, options);