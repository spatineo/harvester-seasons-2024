/* eslint-disable @typescript-eslint/no-unsafe-return */
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
import {
  tenYearsBack,
  tenYearsLater,
  addMonths,
  reduceMonths,
} from "../../utils/dateHelperFunctions";
import { asStartEndTimeSpan, scaleEnsembleData } from "../../utils/helpers";
import { RootState } from "../store";
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

export function* triggerTimeSpanChange({
  payload
}: ReturnType<typeof actions.changeYear>): SagaIterator {
  if (payload === "next") {
    const endDate = addMonths(new Date(), 6).toISOString();
    const startDate = reduceMonths(new Date(), 6).toISOString();
    const mark = reduceMonths(new Date(), 6).setDate(
      reduceMonths(new Date(), 6).getDate() + 14
    );
    const newMarkLineDate = new Date(mark).toISOString();
    yield put(actions.setMarkLine(newMarkLineDate));
    yield put(
      actions.setTimeEndStartSpan({
        start_time: startDate,
        end_time: endDate,
        time_step: 24 * 60
      })
    );
  } else if (payload === "previous") {
    const startDate = tenYearsBack();
    const dateEnd = tenYearsLater(startDate).toISOString();
    yield put(
      actions.setTimeEndStartSpan({
        start_time: tenYearsBack().toISOString(),
        end_time: dateEnd,
        time_step: 24 * 60
      })
    );
    const newMarkLineDate = new Date(tenYearsBack().toISOString());
    newMarkLineDate.setMonth(newMarkLineDate.getMonth() + 1);
    const newDate = newMarkLineDate.toISOString();
    yield put(actions.setMarkLine(newDate));
  }
  yield put({ type: constants.TRAFFICABILITY_API });
  yield put({ type: constants.SOILTEMPERATUE_API });
  yield put({ type: constants.SOILWETNESS_API });
  yield put({ type: constants.SNOWHEIGHT_API });
  yield put({ type: constants.WINDGUST_API });
  yield put({ type: constants.SETWMSLAYERINFORMATION });
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
  const currentDate = new Date();
  const isInPast = new Date(modifiedEndDate).getTime() < currentDate.getTime();
  const paramater = parameters
    .filter((item) => (isInPast ? !item.ensemble : true))
    .map((p) => p.code)
    .join(",");
  return {
    params: {
      latlon: `${lonlat}`,
      param: "utctime," + paramater,
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

export function* getCapabilitiesSaga(): SagaIterator {
  const layersParams = yield select((state: RootState) => state.global.params);
  const layers: any = [
    ...layersParams.snowHeight.map((layer) => layer.layerName),
    ...layersParams.soilWetness.map((layer) => layer.layerName),
    ...layersParams.soilTemperature.map((layer) => layer.layerName),
    ...layersParams.windGust.map((layer) => layer.layerName)
  ] as string[];

  const parser = new WMSCapabilities();
  const capabilitiesUrl =
    "https://desm.harvesterseasons.com/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0";
  try {
    const response = yield call(fetch, capabilitiesUrl);
    if (response.ok) {
      const responseBody = yield response.text();
      const result = yield parser.read(responseBody);
      if (result) {
        yield put(mapActions.setCapabilities(result.Capability));
        yield all(
          layers.map((l) => {
            function findLayer(layer) {
              let ret = null;
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              if (layer.Name === l) {
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
              return put(mapActions.setLayerState(layer));
            } else {
              window.console.error("No layers not found");
              return null; //{layer: not found}
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
  const startEndTimeSpan: StartEndTimeSpan = asStartEndTimeSpan(
    yield select((state: RootState) => state.global.startEndTimeSpan)
  );

  const params = yield select((state: RootState) => state.global.params);
  yield put(actions.setTrafficabilityData([]));

  try {
    const response = yield call(
      axios.get,
      timeSeriesServiceURL,
      createTimeSeriesQueryParameters(
        startEndTimeSpan,
        params.trafficability,
        userLocation
      )
    );

    if (response.status === 200) {
      window.console.log(response.data)
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

export function* fetchSoilTemperatureSaga() {
  const userLocation = yield select(
    (state: RootState) => state.mapState.position
  );
  if (userLocation.lon === null || userLocation.lon === undefined) {
    return;
  }
  const params = yield select((state: RootState) => state.global.params);
  const startEndTimeSpan: StartEndTimeSpan = asStartEndTimeSpan(
    yield select((state: RootState) => state.global.startEndTimeSpan)
  );

  yield put(actions.setSoilTemperatureData([]));
  try {
    const result = yield call(
      axios.get,
      timeSeriesServiceURL,
      createTimeSeriesQueryParameters(
        startEndTimeSpan,
        params.soilTemperature,
        userLocation
      )
    );
    if (result.status === 200) {
      const data = scaleEnsembleData(result.data, params.soilTemperature);
      yield put(actions.setSoilTemperatureData(data));
    }
  } catch (error) {
    window.console.error(error);
  }
}

export function* fetchSnowHeightSaga() {
  const userLocation = yield select(
    (state: RootState) => state.mapState.position
  );
  if (userLocation.lon === null || userLocation.lon === undefined) {
    return;
  }
  const params = yield select((state: RootState) => state.global.params);
  const startEndTimeSpan: StartEndTimeSpan = asStartEndTimeSpan(
    yield select((state: RootState) => state.global.startEndTimeSpan)
  );
  yield put(actions.setSnowHeightData([]));
  try {
    const result = yield call(
      axios.get,
      timeSeriesServiceURL,
      createTimeSeriesQueryParameters(
        startEndTimeSpan,
        params.snowHeight,
        userLocation
      )
    );
    if (result.status === 200) {
      const data = scaleEnsembleData(result.data, params.snowHeight);
      yield put(actions.setNonScaledDataSnowHeight(result.data));
      yield put(actions.setSnowHeightData(data));
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage: string | [] = error.message;
      window.console.error(errorMessage);
      yield call(EnqueueSnackbar, "Error in network for snow height", "error");
    }
  }
}

export function* fetchSoilWetnessSaga() {
  const userLocation = yield select(
    (state: RootState) => state.mapState.position
  );
  if (userLocation.lon === null || userLocation.lon === undefined) {
    return;
  }
  const params = yield select((state: RootState) => state.global.params);
  const startEndTimeSpan: StartEndTimeSpan = asStartEndTimeSpan(
    yield select((state: RootState) => state.global.startEndTimeSpan)
  );

  //omit ensemble values
  try {
    yield put(actions.setSoilWetnessData([]));
    const result = yield call(
      axios.get,
      timeSeriesServiceURL,
      createTimeSeriesQueryParameters(
        startEndTimeSpan,
        params.soilWetness,
        userLocation
      )
    );
    if (result.status === 200) {
      const data = scaleEnsembleData(result.data, params.soilWetness);
      yield put(actions.setSoilWetnessData(data));
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage: string | [] = error.message;
      window.console.error(errorMessage);
      yield call(EnqueueSnackbar, "Error in network for soil wetness", "error");
    }
  }
}

export function* fetchWindGustSaga() {
  const userLocation = yield select(
    (state: RootState) => state.mapState.position
  );
  if (userLocation.lon === null || userLocation.lon === undefined) {
    return;
  }
  const params = yield select((state: RootState) => state.global.params);
  const startEndTimeSpan: StartEndTimeSpan = asStartEndTimeSpan(
    yield select((state: RootState) => state.global.startEndTimeSpan)
  );
  yield put(actions.setWindGustData([]));
  try {
    const result = yield call(
      axios.get,
      timeSeriesServiceURL,
      createTimeSeriesQueryParameters(
        startEndTimeSpan,
        params.windGust,
        userLocation
      )
    );
    if (result.status === 200) {
      const data = result.data;
      yield put(actions.setWindGustData(data));
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage: string | [] = error.message;
      window.console.error(errorMessage);
      yield call(EnqueueSnackbar, "Error in network for soil wetness", "error");
    }
  }
}

export function* watchHarvesterRequests(): SagaIterator {
  yield takeLatest(constants.POSITION, setUserLocation);
  yield takeLatest(constants.TRAFFICABILITY_API, fetchTrafficabilityDataSaga);
  yield takeLatest(actions.changeYear.type, triggerTimeSpanChange);
  yield takeLatest(constants.SETWMSLAYERINFORMATION, getCapabilitiesSaga);
  yield takeLatest(constants.SOILTEMPERATUE_API, fetchSoilTemperatureSaga);
  yield takeLatest(constants.SNOWHEIGHT_API, fetchSnowHeightSaga);
  yield takeLatest(constants.SOILWETNESS_API, fetchSoilWetnessSaga);
  yield takeLatest(constants.WINDGUST_API, fetchWindGustSaga);
}
