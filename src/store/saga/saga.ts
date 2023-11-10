/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { takeLatest, put, call, select, all } from "redux-saga/effects";
import axios from "axios";
import { SagaIterator } from "redux-saga";
import WMSCapabilities from "ol/format/WMSCapabilities";
// eslint-disable-next-line import/no-extraneous-dependencies
import { actions } from "../../globalSlice";
import * as constants from "../constants";
import * as utils from "../../utils/helpers";
import { RootState, store } from "../store";
import { EnqueueSnackbar } from "../hooks";
import { Parameter, StartEndTimeSpan } from "../../types";
import { mapActions } from "../../MapComponent/MapComponentSlice";

const timeSeriesServiceURL = "https://desm.harvesterseasons.com/timeseries";
export interface TimeSpan {
  start_time: string;
  end_time: string;
  time_step: number;
}

export function* setUserLocation(): SagaIterator {
  yield put({ type: constants.TRAFFICABILITY_API });
  yield put({ type: constants.SOILTEMPERATUE_API });
  yield put({ type: constants.SOILWETNESS_API });
  yield put({ type: constants.SNOWHEIGHT_API });
  yield put({ type: constants.WINDGUST_API });
}

export function* triggerCheckUpdate({
  payload
}: ReturnType<typeof actions.setCheckedButton>): SagaIterator {
  if (payload !== false) {
    const tenYearsTimeSpan = utils.addTenYears(new Date(), 10).toISOString();
    yield put(
      actions.setTimeEndStartSpan({
        start_time: utils.getStartSearchDate().toISOString(),
        end_time: tenYearsTimeSpan,
        time_step: 1440 // one week
      })
    );
    yield put({ type: constants.TRAFFICABILITY_API });
    yield put({ type: constants.SOILTEMPERATUE_API });
    yield put({ type: constants.SOILWETNESS_API });
    yield put({ type: constants.SNOWHEIGHT_API });
    yield put({ type: constants.WINDGUST_API });
    yield put({ type: constants.SETWMSLAYERINFORMATION });
  } else {
    const oneYear = utils
      .addMonths(utils.getStartSearchDate(), 12)
      .toISOString();
    yield put(
      actions.setTimeEndStartSpan({
        start_time: utils.getStartSearchDate().toISOString(),
        end_time: oneYear,
        time_step: 24 * 60 // 24 hours
      })
    );
    yield put({ type: constants.TRAFFICABILITY_API });
    yield put({ type: constants.SOILTEMPERATUE_API });
    yield put({ type: constants.SOILWETNESS_API });
    yield put({ type: constants.SNOWHEIGHT_API });
    yield put({ type: constants.WINDGUST_API });
  }
}

export function* triggerTimeSpanChange({
  payload
}: ReturnType<typeof actions.changeYear>): SagaIterator {
  //const previousOrNext = yield select((state: RootState) => state.global.sta)
  const start = yield select(
    (state: RootState) => state.global.startEndTimeSpan
  );
  const markline = yield select((state: RootState) => state.global.markLine);

  if (payload === "next") {
    const newDate = new Date(
      utils.increaseByOneYear(markline, 1)
    ).toISOString();
    yield put(actions.setMarkLine(newDate));
    yield put(
      actions.setTimeEndStartSpan({
        start_time: utils
          .increaseByOneYear(new Date(start.start_time), 1)
          .toISOString(),
        end_time: utils
          .increaseByOneYear(new Date(start.end_time), 1)
          .toISOString(),
        time_step: 24 * 60
      })
    );
  } else if (payload === "previous") {
    const newDate = new Date(
      utils.decreaseByOneYear(markline, 1)
    ).toISOString();
    yield put(actions.setMarkLine(newDate));
    yield put(
      actions.setTimeEndStartSpan({
        start_time: utils
          .decreaseByOneYear(new Date(start.start_time), 1)
          .toISOString(),
        end_time: utils
          .decreaseByOneYear(new Date(start.end_time), 1)
          .toISOString(),
        time_step: 24 * 60
      })
    );
  }
  yield put({ type: constants.TRAFFICABILITY_API });
  yield put({ type: constants.SOILTEMPERATUE_API });
  yield put({ type: constants.SOILWETNESS_API });
  yield put({ type: constants.SNOWHEIGHT_API });
  yield put({ type: constants.WINDGUST_API });
}

function createTimeSeriesQueryParameters(
  startEndTimeSpan: StartEndTimeSpan,
  parameters: Parameter[],
  userLocation: {
    lat: number | null;
    lon: number | null;
    resolution: number;
  }
) {
  const modifiedStartDate = new Date(startEndTimeSpan.start_time).toISOString();
  const modifiedEndDate = new Date(startEndTimeSpan.end_time).toISOString();

  const lonlat = `${userLocation.lat || "N/A"},${userLocation.lon || "N/A"}`;
  return {
    params: {
      latlon: `${lonlat}`,
      param: "utctime," + parameters.map((p) => p.code).join(","),
      starttime: modifiedStartDate,
      endtime: modifiedEndDate,
      timestep: startEndTimeSpan.time_step,
      format: "json",
      source: "grid",
      tz: "utc",
      timeformat: "xml",
      precision: "full"
    }
  };
}

export function* fetchWindSpeedData(): SagaIterator {
  const userLocation = yield select(
    (state: RootState) => state.mapState.position
  );

  if (userLocation.lon === null || userLocation.lon === undefined) {
    return;
  }

  const startEndTimeSpan: StartEndTimeSpan = utils.asStartEndTimeSpan(
    yield select((state: RootState) => state.global.startEndTimeSpan)
  );
  const modifiedStartDate = new Date(startEndTimeSpan.start_time).toISOString();
  const modifiedEndDate = new Date(startEndTimeSpan.end_time).toISOString();
  const lonlat = `${userLocation.lat},${userLocation.lon}`;
  const url = `https://desm.harvesterseasons.com/timeseries?latlon=${lonlat}&param=utctime,FFG-MS:CERRA:5057:6:10:0&starttime=${modifiedStartDate}&endtime=${modifiedEndDate}&timestep=1440&format=json&source=grid&tz=utc&timeformat=xml&precision=full`;
  try {
    const response = yield call(axios.get, url);
    if (response.status === 200) {
      const tmp = response.data;
      yield put(actions.setWindSpeedData(tmp));
    }
  } catch (e) {
    window.console.error(e);
    yield call(
      EnqueueSnackbar,
      "Error in network for Wind gust server",
      "error"
    );
  }
}

export function* getCapabilitiesSaga(): SagaIterator {
   const layers =  yield select(
    (state: RootState) => state.mapState.WMSLayerState
  ); 

  const parser = new WMSCapabilities();
  const capabilitiesUrl =
    "https://desm.harvesterseasons.com/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0";
  try {
    const response = yield call(fetch, capabilitiesUrl);
    if (response.ok) {
      const responseBody = yield response.text();
      const result = yield parser.read(responseBody);
      if (result) {
        yield put(mapActions.setWMSLayerInformation(result));

        yield all(
          layers.map((l) => {
            function findLayer(layer) {
              let ret = null;
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              if (l.layerName === layer.Name) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                ret = layer;
              } else if (layer.Layer) {
                for (let i = 0; i < layer.Layer.length; i++) {
                  ret = findLayer(layer.Layer[i]);
                  if (ret) break;
                }
              }
              return ret;
            }

            const layer = findLayer(result.Capability.Layer);
            if (layer !== null) {
              return put(mapActions.setWMSLayerInformation(layer));
            } else {
              window.console.error("No layers not found");
            }
          })
        ); 
      }
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      yield call(
        EnqueueSnackbar,
        `${error.message} in get capabilities`,
        "error"
      );
    }
  }
}

export function* fetchTrafficabilityDataSaga(): SagaIterator {
  const userLocation = yield select(
    (state: RootState) => state.mapState.position
  );
  if (userLocation.lon === null || userLocation.lon === undefined) {
    return;
  }
  const startEndTimeSpan: StartEndTimeSpan = utils.asStartEndTimeSpan(
    yield select((state: RootState) => state.global.startEndTimeSpan)
  );

  const checked = yield select((state: RootState) => state.global.checked);
  const parameters = checked
    ? yield select(
        (state: RootState) =>
          state.global.parameters.tenYearParams.trafficability
      )
    : yield select(
        (state: RootState) =>
          state.global.parameters.twelveMonthParams.trafficability
      );
  try {
    const response = yield call(
      axios.get,
      timeSeriesServiceURL,
      createTimeSeriesQueryParameters(
        startEndTimeSpan,
        parameters,
        userLocation
      )
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
        "error"
      );
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
    ? yield select(
        (state: RootState) =>
          state.global.parameters.tenYearParams.soilTemperature
      )
    : yield select(
        (state: RootState) =>
          state.global.parameters.twelveMonthParams.soilTemperature
      );
  try {
    const response = yield call(
      axios.get,
      timeSeriesServiceURL,
      createTimeSeriesQueryParameters(
        startEndTimeSpan,
        parameters,
        userLocation
      )
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
        "error"
      );
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
    ? yield select(
        (state: RootState) => state.global.parameters.tenYearParams.soilWetness
      )
    : yield select(
        (state: RootState) =>
          state.global.parameters.twelveMonthParams.soilWetness
      );
  try {
    const response = yield call(
      axios.get,
      timeSeriesServiceURL,
      createTimeSeriesQueryParameters(
        startEndTimeSpan,
        parameters,
        userLocation
      )
    );
    if (response.status === 200) {
      yield put(actions.setSoilWetnessData(response.data));
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage: string | [] = error.message;
      window.console.error(errorMessage);
      yield call(EnqueueSnackbar, "Error in network for soil wetness", "error");
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
    ? yield select(
        (state: RootState) => state.global.parameters.tenYearParams.snowHeight
      )
    : yield select(
        (state: RootState) =>
          state.global.parameters.twelveMonthParams.snowHeight
      );

  try {
    const response = yield call(
      axios.get,
      timeSeriesServiceURL,
      createTimeSeriesQueryParameters(
        startEndTimeSpan,
        parameters,
        userLocation
      )
    );
    if (response.status === 200) {
      yield put(actions.setSnowHeightData(response.data));
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage: string | [] = error.message;
      window.console.error(errorMessage);
      yield call(EnqueueSnackbar, "Error in network for snow height", "error");
    }
  }
}

export function* watchHarvesterRequests(): SagaIterator {
  yield takeLatest(constants.POSITION, setUserLocation);
  yield takeLatest(actions.setCheckedButton.type, triggerCheckUpdate);
  yield takeLatest(constants.TRAFFICABILITY_API, fetchTrafficabilityDataSaga);
  yield takeLatest(constants.WINDGUST_API, fetchWindSpeedData);
  yield takeLatest(constants.SOILWETNESS_API, fetchSoilWetnessDataSaga);
  yield takeLatest(constants.SOILTEMPERATUE_API, soilTemperatureDataSaga);
  yield takeLatest(constants.SNOWHEIGHT_API, fetchSnowHeightDataSaga);
  yield takeLatest(actions.changeYear.type, triggerTimeSpanChange);
  yield takeLatest(constants.SETWMSLAYERINFORMATION, getCapabilitiesSaga);
}
