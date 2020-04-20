import { Machine, assign, sendParent, forwardTo, spawn } from "xstate";
import { setContext } from "apollo-link-context";

export const AuthLinkMachine = Machine({
  id: 'auth-link-machine',
  context: {
    link: null,
    service: null
  },
  initial: 'initializing',
  states: {
    initializing: {
      entry: 'createService',
      on: {
        SET_LINK: {
          actions: 'setLink',
          target: 'running',
        }
      }
    },
    running: {
      on: {
        'link.getToken': {
          actions: sendParent('link.getToken')
        },
        API_TOKEN: {
          actions: forwardTo('link-service'),
        }
      }
    }
  },
},{
  actions: {
    createService: assign({
      service: () => spawn(
        (callback, onReceive) => {
          let resolveToken = null;

          onReceive(({ type, value }) => {
            if (type === 'API_TOKEN') {
              resolveToken && resolveToken(value);
            }
          });

          const link = setContext(({ headers }) => {
            const promise = new Promise(resolve => {
              resolveToken = token => resolve({
                headers: {
                  ...headers,
                  Authorization: `Bearer ${token}`
                }
              });
            });

            callback('link.getToken');
            return promise;
          });

          callback({ type: 'SET_LINK', link });
        },
        { name: 'link-service' }
      ),
    }),

    setLink: assign({
      link: (_, { link }) => link,
    })
  }
});