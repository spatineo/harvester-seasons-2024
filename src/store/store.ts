import { configureStore } from '@reduxjs/toolkit';
import { all, fork } from 'redux-saga/effects';
import createSagaMiddleware, { SagaIterator } from 'redux-saga';
import { watchHarvesterRequests } from './saga/saga';
import languageSlice from '../Lang/languageSlice';
import MapComponentSlice from '../MapComponent/MapComponentSlice';
import globalSlice from '../globalSlice';

export function* rootSaga(): SagaIterator {
	yield all([fork(watchHarvesterRequests)]);
}

const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
	reducer: {
		language: languageSlice,
		mapState: MapComponentSlice,
		global: globalSlice,
	},
	middleware: [sagaMiddleware],
	devTools: import.meta.env.NODE_ENV !== 'production',
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;
