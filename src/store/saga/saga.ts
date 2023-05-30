/* eslint-disable @typescript-eslint/restrict-template-expressions */
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
import { RootState, store } from '../store';
import { Parameter, StartEndTimeSpan } from '../../types';
import { MapPosition, mapActions } from '../../MapComponent/MapComponentSlice';

const trafficability = `https://desm.harvesterseasons.com/timeseries?latlon=64,27&param=utctime,HSNOW-M:ECBSF::1:0:1:0,HSNOW-M:ECBSF::1:0:3:1,HSNOW-M:ECBSF::1:0:3:2,HSNOW-M:ECBSF::1:0:3:3,HSNOW-M:ECBSF::1:0:3:4,HSNOW-M:ECBSF::1:0:3:5,HSNOW-M:ECBSF::1:0:3:6,HSNOW-M:ECBSF::1:0:3:7,HSNOW-M:ECBSF::1:0:3:8,HSNOW-M:ECBSF::1:0:3:9,HSNOW-M:ECBSF::1:0:3:10,HSNOW-M:ECBSF::1:0:3:11,HSNOW-M:ECBSF::1:0:3:12,HSNOW-M:ECBSF::1:0:3:13,HSNOW-M:ECBSF::1:0:3:14,HSNOW-M:ECBSF::1:0:3:15,HSNOW-M:ECBSF::1:0:3:16,HSNOW-M:ECBSF::1:0:3:17,HSNOW-M:ECBSF::1:0:3:18,HSNOW-M:ECBSF::1:0:3:19,HSNOW-M:ECBSF::1:0:3:20,HSNOW-M:ECBSF::1:0:3:21,HSNOW-M:ECBSF::1:0:3:22,HSNOW-M:ECBSF::1:0:3:23,HSNOW-M:ECBSF::1:0:3:24,HSNOW-M:ECBSF::1:0:3:25,HSNOW-M:ECBSF::1:0:3:26,HSNOW-M:ECBSF::1:0:3:27,HSNOW-M:ECBSF::1:0:3:28,HSNOW-M:ECBSF::1:0:3:29,HSNOW-M:ECBSF::1:0:3:30,HSNOW-M:ECBSF::1:0:3:31,HSNOW-M:ECBSF::1:0:3:32,HSNOW-M:ECBSF::1:0:3:33,HSNOW-M:ECBSF::1:0:3:34,HSNOW-M:ECBSF::1:0:3:35,HSNOW-M:ECBSF::1:0:3:36,HSNOW-M:ECBSF::1:0:3:37,HSNOW-M:ECBSF::1:0:3:38,HSNOW-M:ECBSF::1:0:3:39,HSNOW-M:ECBSF::1:0:3:40,HSNOW-M:ECBSF::1:0:3:41,HSNOW-M:ECBSF::1:0:3:42,HSNOW-M:ECBSF::1:0:3:43,HSNOW-M:ECBSF::1:0:3:44,HSNOW-M:ECBSF::1:0:3:45,HSNOW-M:ECBSF::1:0:3:46,HSNOW-M:ECBSF::1:0:3:47,HSNOW-M:ECBSF::1:0:3:48,HSNOW-M:ECBSF::1:0:3:49,HSNOW-M:ECBSF::1:0:3:50,DIFF{HSNOW-M:ECBSF::1:0:1:0;0},DIFF{HSNOW-M:ECBSF::1:0:3:1;0},DIFF{HSNOW-M:ECBSF::1:0:3:2;0},DIFF{HSNOW-M:ECBSF::1:0:3:3;0},DIFF{HSNOW-M:ECBSF::1:0:3:4;0},DIFF{HSNOW-M:ECBSF::1:0:3:5;0},DIFF{HSNOW-M:ECBSF::1:0:3:6;0},DIFF{HSNOW-M:ECBSF::1:0:3:7;0},DIFF{HSNOW-M:ECBSF::1:0:3:8;0},DIFF{HSNOW-M:ECBSF::1:0:3:9;0},DIFF{HSNOW-M:ECBSF::1:0:3:10;0},DIFF{HSNOW-M:ECBSF::1:0:3:11;0},DIFF{HSNOW-M:ECBSF::1:0:3:12;0},DIFF{HSNOW-M:ECBSF::1:0:3:13;0},DIFF{HSNOW-M:ECBSF::1:0:3:14;0},DIFF{HSNOW-M:ECBSF::1:0:3:15;0},DIFF{HSNOW-M:ECBSF::1:0:3:16;0},DIFF{HSNOW-M:ECBSF::1:0:3:17;0},DIFF{HSNOW-M:ECBSF::1:0:3:18;0},DIFF{HSNOW-M:ECBSF::1:0:3:19;0},DIFF{HSNOW-M:ECBSF::1:0:3:20;0},DIFF{HSNOW-M:ECBSF::1:0:3:21;0},DIFF{HSNOW-M:ECBSF::1:0:3:22;0},DIFF{HSNOW-M:ECBSF::1:0:3:23;0},DIFF{HSNOW-M:ECBSF::1:0:3:24;0},DIFF{HSNOW-M:ECBSF::1:0:3:25;0},DIFF{HSNOW-M:ECBSF::1:0:3:26;0},DIFF{HSNOW-M:ECBSF::1:0:3:27;0},DIFF{HSNOW-M:ECBSF::1:0:3:28;0},DIFF{HSNOW-M:ECBSF::1:0:3:29;0},DIFF{HSNOW-M:ECBSF::1:0:3:30;0},DIFF{HSNOW-M:ECBSF::1:0:3:31;0},DIFF{HSNOW-M:ECBSF::1:0:3:32;0},DIFF{HSNOW-M:ECBSF::1:0:3:33;0},DIFF{HSNOW-M:ECBSF::1:0:3:34;0},DIFF{HSNOW-M:ECBSF::1:0:3:35;0},DIFF{HSNOW-M:ECBSF::1:0:3:36;0},DIFF{HSNOW-M:ECBSF::1:0:3:37;0},DIFF{HSNOW-M:ECBSF::1:0:3:38;0},DIFF{HSNOW-M:ECBSF::1:0:3:39;0},DIFF{HSNOW-M:ECBSF::1:0:3:40;0},DIFF{HSNOW-M:ECBSF::1:0:3:41;0},DIFF{HSNOW-M:ECBSF::1:0:3:42;0},DIFF{HSNOW-M:ECBSF::1:0:3:43;0},DIFF{HSNOW-M:ECBSF::1:0:3:44;0},DIFF{HSNOW-M:ECBSF::1:0:3:45;0},DIFF{HSNOW-M:ECBSF::1:0:3:46;0},DIFF{HSNOW-M:ECBSF::1:0:3:47;0},DIFF{HSNOW-M:ECBSF::1:0:3:48;0},DIFF{HSNOW-M:ECBSF::1:0:3:49;0},DIFF{HSNOW-M:ECBSF::1:0:3:50;0},HSNOW-M:SMARTOBS:13:4&starttime=202305020000&endtime=202312040000&timestep=1440&timeformat=xml&precision=full&source=grid&tz=utc&format=json`
const timeSeriesServiceURL = 'https://desm.harvesterseasons.com/timeseries';
export interface TimeSpan {
	start_time: string;
	end_time: string;
	time_step: number;
}

`
https://desm.harvesterseasons.com/timeseries?latlon=64,27&
param=utctime,
HSNOW-M:ECBSF::1:0:1:0,
HSNOW-M:ECBSF::1:0:3:1,
HSNOW-M:ECBSF::1:0:3:2,
HSNOW-M:ECBSF::1:0:3:3,HSNOW-M:ECBSF::1:0:3:4,HSNOW-M:ECBSF::1:0:3:5,HSNOW-M:ECBSF::1:0:3:6,HSNOW-M:ECBSF::1:0:3:7,HSNOW-M:ECBSF::1:0:3:8,HSNOW-M:ECBSF::1:0:3:9,HSNOW-M:ECBSF::1:0:3:10,HSNOW-M:ECBSF::1:0:3:11,HSNOW-M:ECBSF::1:0:3:12,HSNOW-M:ECBSF::1:0:3:13,HSNOW-M:ECBSF::1:0:3:14,HSNOW-M:ECBSF::1:0:3:15,HSNOW-M:ECBSF::1:0:3:16,HSNOW-M:ECBSF::1:0:3:17,HSNOW-M:ECBSF::1:0:3:18,HSNOW-M:ECBSF::1:0:3:19,HSNOW-M:ECBSF::1:0:3:20,HSNOW-M:ECBSF::1:0:3:21,HSNOW-M:ECBSF::1:0:3:22,HSNOW-M:ECBSF::1:0:3:23,HSNOW-M:ECBSF::1:0:3:24,HSNOW-M:ECBSF::1:0:3:25,HSNOW-M:ECBSF::1:0:3:26,HSNOW-M:ECBSF::1:0:3:27,HSNOW-M:ECBSF::1:0:3:28,HSNOW-M:ECBSF::1:0:3:29,HSNOW-M:ECBSF::1:0:3:30,HSNOW-M:ECBSF::1:0:3:31,HSNOW-M:ECBSF::1:0:3:32,HSNOW-M:ECBSF::1:0:3:33,HSNOW-M:ECBSF::1:0:3:34,HSNOW-M:ECBSF::1:0:3:35,HSNOW-M:ECBSF::1:0:3:36,HSNOW-M:ECBSF::1:0:3:37,HSNOW-M:ECBSF::1:0:3:38,HSNOW-M:ECBSF::1:0:3:39,HSNOW-M:ECBSF::1:0:3:40,HSNOW-M:ECBSF::1:0:3:41,HSNOW-M:ECBSF::1:0:3:42,HSNOW-M:ECBSF::1:0:3:43,HSNOW-M:ECBSF::1:0:3:44,HSNOW-M:ECBSF::1:0:3:45,HSNOW-M:ECBSF::1:0:3:46,HSNOW-M:ECBSF::1:0:3:47,HSNOW-M:ECBSF::1:0:3:48,HSNOW-M:ECBSF::1:0:3:49,
HSNOW-M:ECBSF::1:0:3:50,
DIFF{HSNOW-M:ECBSF::1:0:1:0;0},
DIFF{HSNOW-M:ECBSF::1:0:3:1;0},DIFF{HSNOW-M:ECBSF::1:0:3:2;0},DIFF{HSNOW-M:ECBSF::1:0:3:3;0},DIFF{HSNOW-M:ECBSF::1:0:3:4;0},DIFF{HSNOW-M:ECBSF::1:0:3:5;0},DIFF{HSNOW-M:ECBSF::1:0:3:6;0},DIFF{HSNOW-M:ECBSF::1:0:3:7;0},DIFF{HSNOW-M:ECBSF::1:0:3:8;0},DIFF{HSNOW-M:ECBSF::1:0:3:9;0},DIFF{HSNOW-M:ECBSF::1:0:3:10;0},DIFF{HSNOW-M:ECBSF::1:0:3:11;0},DIFF{HSNOW-M:ECBSF::1:0:3:12;0},DIFF{HSNOW-M:ECBSF::1:0:3:13;0},DIFF{HSNOW-M:ECBSF::1:0:3:14;0},DIFF{HSNOW-M:ECBSF::1:0:3:15;0},DIFF{HSNOW-M:ECBSF::1:0:3:16;0},DIFF{HSNOW-M:ECBSF::1:0:3:17;0},DIFF{HSNOW-M:ECBSF::1:0:3:18;0},DIFF{HSNOW-M:ECBSF::1:0:3:19;0},DIFF{HSNOW-M:ECBSF::1:0:3:20;0},DIFF{HSNOW-M:ECBSF::1:0:3:21;0},DIFF{HSNOW-M:ECBSF::1:0:3:22;0},DIFF{HSNOW-M:ECBSF::1:0:3:23;0},DIFF{HSNOW-M:ECBSF::1:0:3:24;0},DIFF{HSNOW-M:ECBSF::1:0:3:25;0},DIFF{HSNOW-M:ECBSF::1:0:3:26;0},DIFF{HSNOW-M:ECBSF::1:0:3:27;0},DIFF{HSNOW-M:ECBSF::1:0:3:28;0},DIFF{HSNOW-M:ECBSF::1:0:3:29;0},DIFF{HSNOW-M:ECBSF::1:0:3:30;0},DIFF{HSNOW-M:ECBSF::1:0:3:31;0},DIFF{HSNOW-M:ECBSF::1:0:3:32;0},DIFF{HSNOW-M:ECBSF::1:0:3:33;0},DIFF{HSNOW-M:ECBSF::1:0:3:34;0},DIFF{HSNOW-M:ECBSF::1:0:3:35;0},DIFF{HSNOW-M:ECBSF::1:0:3:36;0},DIFF{HSNOW-M:ECBSF::1:0:3:37;0},DIFF{HSNOW-M:ECBSF::1:0:3:38;0},DIFF{HSNOW-M:ECBSF::1:0:3:39;0},DIFF{HSNOW-M:ECBSF::1:0:3:40;0},DIFF{HSNOW-M:ECBSF::1:0:3:41;0},DIFF{HSNOW-M:ECBSF::1:0:3:42;0},DIFF{HSNOW-M:ECBSF::1:0:3:43;0},DIFF{HSNOW-M:ECBSF::1:0:3:44;0},DIFF{HSNOW-M:ECBSF::1:0:3:45;0},DIFF{HSNOW-M:ECBSF::1:0:3:46;0},DIFF{HSNOW-M:ECBSF::1:0:3:47;0},DIFF{HSNOW-M:ECBSF::1:0:3:48;0},DIFF{HSNOW-M:ECBSF::1:0:3:49;0},DIFF{HSNOW-M:ECBSF::1:0:3:50;0},HSNOW-M:SMARTOBS:13:4&
starttime=202305020000&endtime=202312040000&timestep=1440&timeformat=xml&precision=full&source=grid&tz=utc&format=json
`
export function* setUserLocation({
	payload,
}: ReturnType<typeof mapActions.setPosition>): SagaIterator {
	yield put({ type: constants.TRAFFICABILITY_API });
	yield put({ type: constants.SOILTEMPERATUE_API });
	yield put({ type: constants.SOILWETNESS_API });
	yield put({ type: constants.SNOWHEIGHT_API });
}

export function* triggerCheckUpdate({
	payload,
}: ReturnType<typeof actions.setCheckedButton>): SagaIterator {
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

function createTimeSeriesQueryParameters(
	startEndTimeSpan: StartEndTimeSpan,
	parameters: Parameter[],
	userLocation: MapPosition
) {
	const modifiedStartDate = new Date(startEndTimeSpan.start_time).toISOString();
	const modifiedEndDate = new Date(startEndTimeSpan.end_time).toISOString();

	const lonlat = `${userLocation.lat || 'N/A'},${userLocation.lon || 'N/A'}`;
	return {
		params: {
			latlon: `${lonlat}`,
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

export function* fetchTrafficabilityDataSaga({
	payload,
}: ReturnType<typeof actions.setTrafficabilityData>): SagaIterator {
	const userLocation = yield select((state: RootState) => state.mapState.position);
	if (userLocation.lon === null || userLocation.lon === undefined) {
		return;
	}
	const startEndTimeSpan: StartEndTimeSpan = utils.asStartEndTimeSpan(
		yield select((state: RootState) => state.global.startEndTimeSpan)
	);

	const checked = yield select((state: RootState) => state.global.checked);
	const parameters = checked
		? yield select((state: RootState) => state.global.parameters.tenYearParams.trafficability)
		: yield select((state: RootState) => state.global.parameters.sixMonthParams.trafficability);

	const modifiedStartDate = new Date(startEndTimeSpan.start_time).toISOString();
	const modifiedEndDate = new Date(startEndTimeSpan.end_time).toISOString();
	// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
	const lonlat = `${userLocation.lat},${userLocation.lon}`;
	try {
		const response = yield call(
			// eslint-disable-next-line @typescript-eslint/unbound-method
			axios.get,
		/* 	timeSeriesServiceURL,
			{
				params: {
					latlon: `${lonlat}`,
					param: 'utctime,' + parameters.map((p: Parameter) => p.code).join(','),
					starttime: modifiedStartDate,
					endtime: modifiedEndDate,
					timestep: startEndTimeSpan.time_step,
					format: 'json',
					source: 'grid',
					tz: 'utc',
					timeformat: 'xml',
				},
			} */
			trafficability
		);

		if (response.status === 200) {
			yield put(actions.setTrafficabilityData(response.data));
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const errorMessage: string | [] = error.message;
			window.console.error(errorMessage);
		}
	}
}

export function* soilTemperatureDataSaga(): SagaIterator {
	const userLocation = store.getState().mapState.position;
	if (userLocation.lon === null || userLocation.lon === undefined) {
		return;
	}
	const startEndTimeSpan: StartEndTimeSpan = utils.asStartEndTimeSpan(
		yield select((state: RootState) => state.global.startEndTimeSpan)
	);
	const checked = yield select((state: RootState) => state.global.checked);
	const parameters = checked
		? yield select((state: RootState) => state.global.parameters.tenYearParams.soilTemperature)
		: yield select((state: RootState) => state.global.parameters.sixMonthParams.soilTemperature);

	try {
		const response = yield call(
			axios.get,
			timeSeriesServiceURL,
			createTimeSeriesQueryParameters(startEndTimeSpan, parameters, userLocation)
		);
		if (response.status === 200) {
			const tmp = response.data;
			yield put(actions.setSoilTemperatureData(tmp));
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const errorMessage: string | [] = error.message;
			window.console.error(errorMessage);
		}
	}
}

export function* fetchSoilWetnessDataSaga(): SagaIterator {
	const userLocation = store.getState().mapState.position;
	if (userLocation.lon === null || userLocation.lon === undefined) {
		return;
	}
	const startEndTimeSpan: StartEndTimeSpan = utils.asStartEndTimeSpan(
		yield select((state: RootState) => state.global.startEndTimeSpan)
	);
	const checked = yield select((state: RootState) => state.global.checked);
	const parameters = checked
		? yield select((state: RootState) => state.global.parameters.tenYearParams.soilWetness)
		: yield select((state: RootState) => state.global.parameters.sixMonthParams.soilWetness);
	try {
		const response = yield call(
			axios.get,
			timeSeriesServiceURL,
			createTimeSeriesQueryParameters(startEndTimeSpan, parameters, userLocation)
		);
		if (response.status === 200) {
			const tmp = response.data;
			yield put(actions.setSoilWetnessData(tmp));
		}
	} catch (error) {
		window.console.error(error);
		if (axios.isAxiosError(error)) {
			const errorMessage: string | [] = error.message;
			window.console.error(errorMessage);
		}
	}
}

export function* fetchSnowHeightDataSaga(): SagaIterator {
	const userLocation = store.getState().mapState.position;
	if (userLocation.lon === null || userLocation.lon === undefined) return;

	const startEndTimeSpan: StartEndTimeSpan = utils.asStartEndTimeSpan(
		yield select((state: RootState) => state.global.startEndTimeSpan)
	);
	const checked = yield select((state: RootState) => state.global.checked);
	const parameters = checked
		? yield select((state: RootState) => state.global.parameters.tenYearParams.snowHeight)
		: yield select((state: RootState) => state.global.parameters.sixMonthParams.snowHeight);

	try {
		const response = yield call(
			axios.get,
			timeSeriesServiceURL,
			createTimeSeriesQueryParameters(startEndTimeSpan, parameters, userLocation)
		);
		if (response.status === 200) {
			const tmp = response.data;
			yield put(actions.setSnowHeightData(tmp));
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const errorMessage: string | [] = error.message;
			window.console.error(errorMessage);
		}
	}
}

export function* watchHarvesterRequests(): SagaIterator {
	yield takeLatest(constants.POSITION, setUserLocation);
	yield takeLatest(actions.setCheckedButton.type, triggerCheckUpdate);
	yield takeLatest(constants.TRAFFICABILITY_API, fetchTrafficabilityDataSaga);
	yield takeLatest(constants.SOILWETNESS_API, fetchSoilWetnessDataSaga);
	yield takeLatest(constants.SOILTEMPERATUE_API, soilTemperatureDataSaga);
	yield takeLatest(constants.SNOWHEIGHT_API, fetchSnowHeightDataSaga);
}
