import { all, fork } from 'redux-saga/effects';
import axios from 'axios';

import authSaga from './authSaga';
import postSaga from './postSaga';

import dotenv from 'dotenv';
dotenv.config();

axios.defaults.baseURL = process.env.REACT_APP_BASIC_SERVER_URL;

// all 은 배열 안의 여러 사가를 동시에 실행시켜줍니다.
export default function* rootSaga() {
  yield all([fork(authSaga), fork(postSaga)]);
}
