import axios from 'axios';
import { all, put, takeEvery, call, fork } from 'redux-saga/effects';
import {
  CLEAR_ERROR_FAILURE,
  CLEAR_ERROR_REQUEST,
  CLEAR_ERROR_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  USER_LOADING_FAILURE,
  USER_LOADING_REQUEST,
  USER_LOADING_SUCCESS,
  PASSWORD_EDIT_UPLOADING_SUCCESS,
  PASSWORD_EDIT_UPLOADING_REQUEST,
  PASSWORD_EDIT_UPLOADING_FAILURE,
} from '../types';

// Login API Axios 함수
const loginUserAPI = (loginData) => {
  console.log(loginData, 'loginData');
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios.post('api/auth', loginData, config);
};

// LOGIN_REQUEST이 들어왔을 때 실행되는 함수
function* loginUser(action) {
  try {
    const result = yield call(loginUserAPI, action.payload);
    console.log(result);
    // put = action 함수 실행
    yield put({
      type: LOGIN_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: LOGIN_FAILURE,
      payload: e.response,
    });
  }
}

// LOGIN_REQUEST 액션이 들어오면 loginUser를 실행하고 take해온 action을 넘겨준다.
function* watchLoginUser() {
  yield takeEvery(LOGIN_REQUEST, loginUser);
}

// LOGOUT
function* logout(action) {
  try {
    yield put({
      type: LOGOUT_SUCCESS,
    });
  } catch (e) {
    yield put({
      type: LOGOUT_FAILURE,
    });
    console.log('LOGOUT', e);
  }
}

function* watchLogout() {
  yield takeEvery(LOGOUT_REQUEST, logout);
}

// User Loading

const userLoadingAPI = (token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return axios.get('api/auth/user', config);
};

function* userLoading(action) {
  try {
    const result = yield call(userLoadingAPI, action.payload);
    yield put({
      type: USER_LOADING_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: USER_LOADING_FAILURE,
      payload: e.response,
    });
  }
}

function* watchUserLoading() {
  yield takeEvery(USER_LOADING_REQUEST, userLoading);
}

// Register

const registerUserAPI = (req) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios.post('api/user', req, config);
};

function* registerUser(action) {
  try {
    const result = yield call(registerUserAPI, action.payload);
    console.log('RegisterUser Data', result);
    // put = action 함수 실행
    yield put({
      type: REGISTER_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: REGISTER_FAILURE,
      payload: e.response,
    });
  }
}

function* watchRegisterUser() {
  yield takeEvery(REGISTER_REQUEST, registerUser);
}

// clear Error

function* clearError(action) {
  try {
    yield put({
      type: CLEAR_ERROR_SUCCESS,
    });
  } catch (e) {
    yield put({
      type: CLEAR_ERROR_FAILURE,
    });
  }
}

function* watchClearError() {
  yield takeEvery(CLEAR_ERROR_REQUEST, clearError);
}

// Edit Password

const EditPasswordAPI = (payload) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const token = payload.token;

  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return axios.post(`/api/user/${payload.userName}/profile`, payload, config);
};

function* EditPassword(action) {
  try {
    console.log(action, 'EditPassword');
    const result = yield call(EditPasswordAPI, action.payload);
    yield put({
      type: PASSWORD_EDIT_UPLOADING_SUCCESS,
      payload: result,
    });
  } catch (e) {
    yield put({
      type: PASSWORD_EDIT_UPLOADING_FAILURE,
      payload: e.response,
    });
  }
}

function* watchEditPassword() {
  yield takeEvery(PASSWORD_EDIT_UPLOADING_REQUEST, EditPassword);
}

export default function* authSaga() {
  // fork = 순서 상관 없는 비동기 실행
  yield all([
    fork(watchLoginUser),
    fork(watchLogout),
    fork(watchUserLoading),
    fork(watchRegisterUser),
    fork(watchClearError),
    fork(watchEditPassword),
  ]);
}
