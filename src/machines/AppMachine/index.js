import auth0 from 'auth0-js'
import { AuthMachine } from "../AuthMachine";
import { UiMachine } from '../UiMachine';
import { NavigationMachine } from "../NavigationMachine";
import authConfig from '../../config/auth';
import AppWorker from 'worker-loader!../AppWorker'; // eslint-disable-line import/no-webpack-loader-syntax
// import ApolloWorker from 'worker-loader!../ApolloMachine/ApolloWorker'; // eslint-disable-line import/no-webpack-loader-syntax
// import { AppWorkerMachine } from "../AppWorker";
// import { ApiMachine } from "../ApiWorker";
import { Router } from "../RouterMachine";
import { TaskMachine } from "../TaskMachine";
import { ApolloMachine } from "../ApolloMachine";
import { GroupListMachine } from "../GroupList";
import { TaskListMachine } from "../TaskListMachine";

export const AppMachine = Router({
  auth: {
    source: AuthMachine.withContext({ config: authConfig }),
    type: 'machine',
  },
  worker: {
    source: AppWorker,
    type: 'worker',
    // createOn: 'SIGNED_IN',
  },
  // ui: {
  //   source: UiMachine,
  //   type: 'machine',
  // },
  // nav: {
  //   source: NavigationMachine,
  //   type: 'machine',
  // },
});