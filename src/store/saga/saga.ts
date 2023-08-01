/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { takeLatest, put, call, select } from 'redux-saga/effects';
import axios from 'axios';
import { SagaIterator } from 'redux-saga';
// eslint-disable-next-line import/no-extraneous-dependencies
import { actions } from '../../globalSlice';
import * as constants from '../constants';
import * as utils from '../../utils';
import { RootState, store } from '../store';
import { EnqueueSnackbar } from '../hooks'
import { Parameter, StartEndTimeSpan, Smartmet } from '../../types';
import { MapPosition, mapActions } from '../../MapComponent/MapComponentSlice';

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
	yield put({ type: constants.SNOWHEIGHT_API });
}

export function* triggerCheckUpdate({
	payload,
}: ReturnType<typeof actions.setCheckedButton>): SagaIterator {
	if (payload !== false) {
		const tenYearsTimeSpan = utils.addTenYears(new Date(), 10).toISOString();
		yield put(
			actions.setTimeEndStartSpan({
				start_time: utils.backDateMonths(new Date(), 6).toISOString(),
				end_time: tenYearsTimeSpan,
				time_step: 1440, // one week
			})
		);
		yield put({ type: constants.TRAFFICABILITY_API });
		yield put({ type: constants.SOILTEMPERATUE_API });
		yield put({ type: constants.SOILWETNESS_API });
		yield put({ type: constants.SNOWHEIGHT_API });
	} else {
		const sixMonthsSpan = utils.addMonths(new Date(), 6).toISOString();
		yield put(
			actions.setTimeEndStartSpan({
				start_time: utils.backDateMonths(new Date(), 6).toISOString(),
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
		: yield select((state: RootState) => state.global.parameters.twelveMonthParams.trafficability);

	const modifiedStartDate = new Date(startEndTimeSpan.start_time).toISOString();
	const modifiedEndDate = new Date(startEndTimeSpan.end_time).toISOString();
	// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
	const lonlat = `${userLocation.lat},${userLocation.lon}`;
	try {
		const response = yield call(
			// eslint-disable-next-line @typescript-eslint/unbound-method
			axios.get,
			timeSeriesServiceURL,
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
			} 
		);

		if (response.status === 200) {
			yield put(actions.setTrafficabilityData(response.data));
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const errorMessage: string | [] = error.message;
			window.console.error(errorMessage);
			yield call(
				EnqueueSnackbar,
				"Error in network for trafficability",
				'error'
			)
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
		: yield select((state: RootState) => state.global.parameters.twelveMonthParams.soilTemperature);

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
			yield call(
				EnqueueSnackbar,
				"Error in network for soil temperature",
				'error'
			)
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
		: yield select((state: RootState) => state.global.parameters.twelveMonthParams.soilWetness);
	try {
		const response = yield call(
			axios.get,
			timeSeriesServiceURL,
			createTimeSeriesQueryParameters(startEndTimeSpan, parameters, userLocation)
		);
		if (response.status === 200) {
			const tmp: Smartmet[] = utils.scaleEnsembleData(response.data, "SWVL2-M3M3:SMARTMET:5015");
			yield put(actions.setSoilWetnessData(tmp));
		}
	} catch (error) {
		window.console.error(error);
		if (axios.isAxiosError(error)) {
			const errorMessage: string | [] = error.message;
			window.console.error(errorMessage);
			yield call(
				EnqueueSnackbar,
				"Error in network for soil wetness",
				'error'
			)
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
		: yield select((state: RootState) => state.global.parameters.twelveMonthParams.snowHeight);

	try {
		const response = yield call(
			axios.get,
			timeSeriesServiceURL,
			createTimeSeriesQueryParameters(startEndTimeSpan, parameters, userLocation)
		);
		if (response.status === 200) {
			const tmp: Smartmet[] = utils.scaleEnsembleData(response.data, "HSNOW-M:SMARTOBS:13:4")
			yield put(actions.setSnowHeightData(tmp));
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const errorMessage: string | [] = error.message;
			window.console.error(errorMessage);
			yield call(
				EnqueueSnackbar,
				"Error in network for snow height",
				'error'
			)
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
