import { configureStore } from "@reduxjs/toolkit"
import languageSlice from '../Lang/languageSlice'
import {all, fork, takeLatest} from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import createSagaMiddleware from 'redux-saga'
import MapComponentSlice from "../MapComponent/MapComponentSlice"
import globalSlice, { actions } from "../globalSlice"
import { useAppSelector } from "./hooks"
import { watchHarvesterRequests } from "./saga/saga"

function* test() {
  yield takeLatest('global/setTrafficabilityData', function* ({ payload }: ReturnType<typeof actions.setTrafficabilityData>): SagaIterator {

  })
}
export function* rootSaga(): SagaIterator {
  yield all([fork(watchHarvesterRequests)])
}


const sagaMiddleware = createSagaMiddleware()
export const store = configureStore({
  reducer: {
    language: languageSlice,
    mapState: MapComponentSlice,
    global: globalSlice
  },
  middleware: [sagaMiddleware],
  devTools: process.env.NODE_ENV !== 'production',
})

sagaMiddleware.run(rootSaga)


export type RootState = ReturnType<typeof store.getState>
export type RootDispatch = typeof store.dispatch
