import { call, put, takeLatest } from "redux-saga/effects";
import { registerApi } from "./register.api";
import { registerRequest, registerSuccess, registerFailure } from "./register.slice";

function* handleRegister(action) {
  try {
    const response = yield call(registerApi, action.payload);
    yield put(registerSuccess(response.data));
  } catch (error) {
    yield put(
      registerFailure(
        error?.response?.data?.message || error.message || "Registration failed."
      )
    );
  }
}

export default function* registerSaga() {
  yield takeLatest(registerRequest.type, handleRegister);
}
