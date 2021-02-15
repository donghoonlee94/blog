import axios from 'axios'
import { all, put, takeEvery, call, fork } from 'redux-saga/effects'
import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS } from '../types'



// Login API Axios 함수
const loginUserAPI = (loginData) => {
  console.log(loginData, 'loginData');
  const config = {
    headers: {
      "Content-Type": "application/json",
    }
  }
  return axios.post('api/auth', loginData, config);
}

// LOGIN_REQUEST이 들어왔을 때 실행되는 함수
function* loginUser(action) {
  try{
    const result = yield call(loginUserAPI, action.payload)
    console.log(result)
    // put = action 함수 실행 
    yield put({
      type: LOGIN_SUCCESS,
      payload: result.data
    })
  }catch(e) {
    yield put({
      type: LOGIN_FAILURE,
      payload: e.response
    })
  }
}

// LOGIN_REQUEST 액션이 들어오면 loginUser 실행
function* watchLoginUser() {
  yield takeEvery(LOGIN_REQUEST, loginUser)
}

export default function* authSaga() {
  // fork = 순서 상관 없는 비동기 실행 
  yield all([
    fork(watchLoginUser)
  ])
}