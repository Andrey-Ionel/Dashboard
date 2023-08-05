import watchMessages from './messagesSaga';
import { all, call, spawn } from 'redux-saga/effects';

export default function* rootSaga() {
  const sagas = [watchMessages];
  const retrySagas = sagas.map(saga => {
    return spawn(function* () {
      while (true) {
        try {
          yield call(saga);
          break;
        } catch (e) {}
      }
    });
  });
  yield all(retrySagas);
}
