import { _ } from "../common/lodash";
import * as commonModules from './pages';
import { all, fork } from 'redux-saga/effects';

const sagas = [];

// Here you can include all the saga which you write for components
_.values(commonModules).forEach((module) => {
  _.values(module).forEach((subModule) => {
    if (_.has(subModule, 'STATE_REDUCER_KEY') && _.has(subModule, 'saga')) {
      sagas.push(fork(subModule.saga));
    }
  });
});

export default function* rootSaga() {
  yield all([...sagas]);
}
