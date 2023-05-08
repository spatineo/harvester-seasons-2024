/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { takeLatest, put, call, select } from 'redux-saga/effects';
import axios from 'axios';
import { SagaIterator } from 'redux-saga';
import { actions } from '../../globalSlice';
import * as constants from '../constants';
import * as utils from '../../utils';
import { RootState } from '../store';
import { Parameter, StartEndTimeSpan } from '../../types';
import { mapActions } from '../../MapComponent/MapComponentSlice';

const timeSeriesServiceURL = 'https://desm.harvesterseasons.com/timeseries';
export interface TimeSpan {
	start_time: string;
	end_time: string;
	time_step: number;
}

export function* setUserLocation({
	payload,
}: ReturnType<typeof mapActions.setPosition>): SagaIterator {
	yield put({ type: constants.TRAFFICABILITY_API });
	yield put({ type: constants.SOILTEMPERATUE_API });
	yield put({ type: constants.SOILWETNESS_API });
}

export function* triggerCheckUpdate({
	payload,
}: ReturnType<typeof actions.setCheckedButton>): SagaIterator {
	//const checked = yield select((state) => state.global.checked);
	if (payload !== false) {
		const tenYearsTimeSpan = utils.addTenYears(new Date(), 10).toISOString();
		yield put(
			actions.setTimeEndStartSpan({
				start_time: new Date().toISOString(),
				end_time: tenYearsTimeSpan,
				time_step: 1440, // one week
			})
		);
		yield put({ type: constants.TRAFFICABILITY_API });
		yield put({ type: constants.SOILTEMPERATUE_API });
		yield put({ type: constants.SOILWETNESS_API });
		yield put({ type: constants.SNOWHEIGHT_API });
	} else {
		const sixMonthsSpan = utils.addSixMonths(new Date(), 6).toISOString();
		yield put(
			actions.setTimeEndStartSpan({
				start_time: new Date().toISOString(),
				end_time: sixMonthsSpan,
				time_step: 24 * 60, // 24 hours
			})
		);
		yield put({ type: constants.TRAFFICABILITY_API });
		yield put({ type: constants.SOILTEMPERATUE_API });
		yield put({ type: constants.SOILWETNESS_API });
		yield put({ type: constants.SNOWHEIGHT_API });
	}
}

export function* fetchTrafficabilityDataSaga({
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	payload,
}: ReturnType<typeof actions.setTrafficabilityData>): SagaIterator {
	const userLocation = yield select(
		(state: RootState) => state.mapState.position
	);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	console.log(userLocation.lon, 'user');
	const startEndTimeSpan: StartEndTimeSpan = utils.asStartEndTimeSpan(
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		yield select((state: RootState) => state.global.startEndTimeSpan)
	);
	const parameters: Parameter[] = yield select(
		(state: RootState) => state.global.parameters.trafficability
	);

	const modifiedStartDate = new Date(startEndTimeSpan.start_time).toISOString();
	const modifiedEndDate = new Date(startEndTimeSpan.end_time).toISOString();

	const lonlat = `${Number(userLocation.lon).toFixed(2)},${Number(
		userLocation.lat
	).toFixed(2)}`;
	try {
		const response = yield call(
			// eslint-disable-next-line @typescript-eslint/unbound-method
			axios.get,
			timeSeriesServiceURL,
			{
				params: {
					latlon: `${lonlat}`,
					param:
						'utctime,' + parameters.map((p: Parameter) => p.code).join(','),
					starttime: modifiedStartDate,
					endtime: modifiedEndDate,
					timestep: startEndTimeSpan.time_step,
					format: 'json',
					source: 'grid',
					tz: 'utc',
					timeformat: 'xml',
				},
			}
		);

		if (response.status === 200) {
			yield put(actions.setTrafficabilityData(response.data));
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const errorMessage: string | [] = error.message;
			window.console.log(errorMessage);
		}
	}
}

function createTimeSeriesQueryParameters(
	startEndTimeSpan: StartEndTimeSpan,
	parameters: Parameter[]
) {
	const modifiedStartDate = new Date(startEndTimeSpan.start_time).toISOString();
	const modifiedEndDate = new Date(startEndTimeSpan.end_time).toISOString();
	return {
		params: {
			latlon: '64,27',
			param: 'utctime,' + parameters.map((p) => p.code).join(','),
			starttime: modifiedStartDate,
			endtime: modifiedEndDate,
			timestep: startEndTimeSpan.time_step,
			format: 'json',
			source: 'grid',
			tz: 'utc',
			timeformat: 'xml',
			precision: 'full',
		},
	};
}

export function* soilTemperatureDataSaga({
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	payload,
}: ReturnType<typeof actions.setSoilTemperatureData>): SagaIterator {
	const startEndTimeSpan: StartEndTimeSpan = utils.asStartEndTimeSpan(
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		yield select((state: RootState) => state.global.startEndTimeSpan)
	);
	const parameters = yield select(
		(state: RootState) => state.global.parameters.soilTemperature
	);

	try {
		const response = yield call(
			axios.get,
			timeSeriesServiceURL,
			createTimeSeriesQueryParameters(startEndTimeSpan, parameters)
		);
		if (response.status === 200) {
			const tmp = response.data;
			yield put(actions.setSoilTemperatureData(tmp));
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const errorMessage: string | [] = error.message;
			window.console.log(errorMessage);
		}
	}
}

export function* fetchSoilWetnessDataSaga({
	payload,
}: ReturnType<typeof actions.setSoilWetnessData>): SagaIterator {
	const startEndTimeSpan: StartEndTimeSpan = utils.asStartEndTimeSpan(
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		yield select((state: RootState) => state.global.startEndTimeSpan)
	);
	const parameters = yield select(
		(state: RootState) => state.global.parameters.soilWetness
	);

	try {
		const response = yield call(
			axios.get,
			timeSeriesServiceURL,
			createTimeSeriesQueryParameters(startEndTimeSpan, parameters)
		);
		if (response.status === 200) {
			const tmp = response.data;
			yield put(actions.setSoilWetnessData(tmp));
		}
	} catch (error) {
		window.console.error(error);
		if (axios.isAxiosError(error)) {
			const errorMessage: string | [] = error.message;
			window.console.log(errorMessage);
		}
	}
}

export function* fetchSnowHeightDataSaga({
	payload,
}: ReturnType<typeof actions.setSnowHeightData>): SagaIterator {
	const startEndTimeSpan: StartEndTimeSpan = utils.asStartEndTimeSpan(
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		yield select((state: RootState) => state.global.startEndTimeSpan)
	);
	const parameters = yield select(
		(state: RootState) => state.global.parameters.snowHeight
	);

	try {
		const response = yield call(
			axios.get,
			timeSeriesServiceURL,
			createTimeSeriesQueryParameters(startEndTimeSpan, parameters)
		);
		if (response.status === 200) {
			const tmp = response.data;
			yield put(actions.setSnowHeightData(tmp));
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const errorMessage: string | [] = error.message;
			window.console.log(errorMessage);
		}
	}
}

export function* watchHarvesterRequests(): SagaIterator {
	yield takeLatest('POSITION', setUserLocation);
	yield takeLatest(actions.setCheckedButton.type, triggerCheckUpdate);
	yield takeLatest(constants.TRAFFICABILITY_API, fetchTrafficabilityDataSaga);
	yield takeLatest(constants.SOILWETNESS_API, fetchSoilWetnessDataSaga);
	yield takeLatest(constants.SOILTEMPERATUE_API, soilTemperatureDataSaga);
	yield takeLatest(constants.SNOWHEIGHT_API, fetchSnowHeightDataSaga);
}
