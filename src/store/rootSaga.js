import { all, fork } from "redux-saga/effects";
import registerSaga from "../pages/register.saga";

export default function* rootSaga() {
  yield all([fork(registerSaga)]);
}
