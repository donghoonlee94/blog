import { all } from 'redux-saga/effects'

// all 은 배열 안의 여러 사가를 동시에 실행시켜줍니다.
export default function* rootSaga() {
  yield all([]);
}