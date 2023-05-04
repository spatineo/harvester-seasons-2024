import {takeLatest, put, call, select } from 'redux-saga/effects'
import axios from 'axios'
import { SagaIterator } from 'redux-saga'
import { actions } from '../../globalSlice'
import * as constants from '../constants'
import * as utils from '../../utils'
import { RootState } from '../store';

export function* triggerCheckUpdate({ payload }: ReturnType<typeof actions.setCheckedButton>): SagaIterator{
 const checked = yield select(state => state.global.checked)
  if(checked !== false) {
    const tenYearsTimeSpan = utils.addTenYears(new Date(), 10).toISOString()
    yield put(actions.setTimeEndStartSpan({
      start_time: new Date().toISOString(),
      end_time: tenYearsTimeSpan,
      time_step: 40320
    }))
    yield put({type: constants.TRAFFICABILITY_API})
  yield put({type: constants.SOILTEMPERATUE_API})
  yield put({type: constants.SOILWETNESS_API})
  yield put({type: constants.SNOWHEIGHT_API})
  } else {
    const sixMonthsSpan = utils.addSixMonths(new Date(), 6).toISOString()
    yield put(actions.setTimeEndStartSpan({
      start_time: new Date().toISOString(),
      end_time: sixMonthsSpan,
      time_step: 40320
    }))
    yield put({type: constants.TRAFFICABILITY_API})
  yield put({type: constants.SOILTEMPERATUE_API})
  yield put({type: constants.SOILWETNESS_API})
  yield put({type: constants.SNOWHEIGHT_API})
  }
  
}

export function* fetchTrafficabilityDataSaga({ payload }: ReturnType<typeof actions.setTrafficabilityData>): SagaIterator {
  const startEndTimeSpan = yield select((state: RootState) => state.global.startEndTimeSpan)
  const start_time = new Date(startEndTimeSpan.start_time).toLocaleDateString().split('/')
  const end_time = new Date(startEndTimeSpan.end_time).toLocaleDateString().split('/')
  const modifiedStartDate = Number(`${start_time[2]}${start_time[1]}${start_time[0]}0000`)
  const modifiedEndDate =  Number(`${end_time[2]}${end_time[1]}${end_time[0]}0000`)
  
    try {
      const response = yield call(axios.get,
      `https://desm.harvesterseasons.com/timeseries?latlon=64,27&param=utctime,HARVIDX{0.4;VSW-M3M3:ECBSF:5022:9:7:0:1-50;VSW-M3M3:ECBSF:5022:9:7:0:0},HARVIDX{273;TSOIL-K:ECBSF:::7:3:1-50;TSOIL-K:ECBSF:::7:1:0},ensover{0.4;0.9;DIFF{SD-M:ECBSF::1:0:1:0;-0.0640000104904175};DIFF{SD-M:ECBSF::1:0:3:1;-0.0640000104904175};DIFF{SD-M:ECBSF::1:0:3:2;0.0141249895095825};DIFF{SD-M:ECBSF::1:0:3:3;-0.0640000104904175};DIFF{SD-M:ECBSF::1:0:3:4;-0.0171250104904175}},HARVIDX{0.4;SWVL2-M3M3:SMARTMET:5015},HARVIDX{-0.7;STL1-K:SMARTMET},ensover{0.4;0.9;SD-M:SMARTMET:5027},ensover{0.4;0.9;HSNOW-M:SMARTOBS:13:4}&starttime=${modifiedStartDate}&endtime=${modifiedEndDate}&timestep=1440&format=json&source=grid&timeformat=xml&tz=utc`
      )
      if(response.status === 200){
        yield put(actions.setTrafficabilityData(response.data))
      }
    } catch (error) {
      if(axios.isAxiosError(error)){
        const errorMessage: string | [] = error.message
        console.log(errorMessage)
        // yield put(actions.setTrafficabilityData(errorMessage))
      }
    }
  }

  export function* soilTemperatureDataSaga ({ payload }: ReturnType<typeof actions.setSoilTemperatureData>): SagaIterator {
    const startEndTimeSpan = yield select((state: RootState) => state.global.startEndTimeSpan)
    const start_time = new Date(startEndTimeSpan.start_time).toLocaleDateString().split('/')
    const end_time = new Date(startEndTimeSpan.end_time).toLocaleDateString().split('/')
    const modifiedStartDate = Number(`${start_time[2]}${start_time[1]}${start_time[0]}0000`)
    const modifiedEndDate =  Number(`${end_time[2]}${end_time[1]}${end_time[0]}0000`)
    //  202304020000&endtime=202311040000
    try{
      let  soilTemperatureURL = `https://desm.harvesterseasons.com/timeseries?latlon=64,27&param=utctime,K2C{TSOIL-K:ECBSF:::7:1:0},K2C{TSOIL-K:ECBSF:::7:3:1},K2C{TSOIL-K:ECBSF:::7:3:2},K2C{TSOIL-K:ECBSF:::7:3:3},K2C{TSOIL-K:ECBSF:::7:3:4},K2C{TSOIL-K:ECBSF:::7:3:5},K2C{TSOIL-K:ECBSF:::7:3:6},K2C{TSOIL-K:ECBSF:::7:3:7},K2C{TSOIL-K:ECBSF:::7:3:8},K2C{TSOIL-K:ECBSF:::7:3:9},K2C{TSOIL-K:ECBSF:::7:3:10},K2C{TSOIL-K:ECBSF:::7:3:11},K2C{TSOIL-K:ECBSF:::7:3:12},K2C{TSOIL-K:ECBSF:::7:3:13},K2C{TSOIL-K:ECBSF:::7:3:14},K2C{TSOIL-K:ECBSF:::7:3:15},K2C{TSOIL-K:ECBSF:::7:3:16},K2C{TSOIL-K:ECBSF:::7:3:17},K2C{TSOIL-K:ECBSF:::7:3:18},K2C{TSOIL-K:ECBSF:::7:3:19},K2C{TSOIL-K:ECBSF:::7:3:20},K2C{TSOIL-K:ECBSF:::7:3:21},K2C{TSOIL-K:ECBSF:::7:3:22},K2C{TSOIL-K:ECBSF:::7:3:23},K2C{TSOIL-K:ECBSF:::7:3:24},K2C{TSOIL-K:ECBSF:::7:3:25},K2C{TSOIL-K:ECBSF:::7:3:26},K2C{TSOIL-K:ECBSF:::7:3:27},K2C{TSOIL-K:ECBSF:::7:3:28},K2C{TSOIL-K:ECBSF:::7:3:29},K2C{TSOIL-K:ECBSF:::7:3:30},K2C{TSOIL-K:ECBSF:::7:3:31},K2C{TSOIL-K:ECBSF:::7:3:32},K2C{TSOIL-K:ECBSF:::7:3:33},K2C{TSOIL-K:ECBSF:::7:3:34},K2C{TSOIL-K:ECBSF:::7:3:35},K2C{TSOIL-K:ECBSF:::7:3:36},K2C{TSOIL-K:ECBSF:::7:3:37},K2C{TSOIL-K:ECBSF:::7:3:38},K2C{TSOIL-K:ECBSF:::7:3:39},K2C{TSOIL-K:ECBSF:::7:3:40},K2C{TSOIL-K:ECBSF:::7:3:41},K2C{TSOIL-K:ECBSF:::7:3:42},K2C{TSOIL-K:ECBSF:::7:3:43},K2C{TSOIL-K:ECBSF:::7:3:44},K2C{TSOIL-K:ECBSF:::7:3:45},K2C{TSOIL-K:ECBSF:::7:3:46},K2C{TSOIL-K:ECBSF:::7:3:47},K2C{TSOIL-K:ECBSF:::7:3:48},K2C{TSOIL-K:ECBSF:::7:3:49},K2C{TSOIL-K:ECBSF:::7:3:50}&starttime=${modifiedStartDate}&endtime=${modifiedEndDate}&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utcutc&format=json`
      const response = yield call(axios.get, soilTemperatureURL)
      if(response.status === 200){
        const tmp = response.data
        yield put(actions.setSoilTemperatureData(tmp))
      }
    } catch (error) {
      console.error(error)
      if(axios.isAxiosError(error)){
        const errorMessage: string | [] = error.message
        console.log(errorMessage)
        // yield put(actions.setSoilTemperatureData(errorMessage))
        }
      }
    }

export function* fetchSoilWetnessDataSaga ({ payload }: ReturnType<typeof actions.setSoilWetnessData>): SagaIterator {
  const startEndTimeSpan = yield select((state: RootState) => state.global.startEndTimeSpan)
  const start_time = new Date(startEndTimeSpan.start_time).toLocaleDateString().split('/')
  const end_time = new Date(startEndTimeSpan.end_time).toLocaleDateString().split('/')
  const modifiedStartDate = Number(`${start_time[2]}${start_time[1]}${start_time[0]}0000`)
  const modifiedEndDate =  Number(`${end_time[2]}${end_time[1]}${end_time[0]}0000`)
  try {
    const url = `https://desm.harvesterseasons.com/timeseries?latlon=64,27&param=utctime,VSW-M3M3:ECBSF:5022:9:7:0:0,VSW-M3M3:ECBSF:5022:9:7:0:1,VSW-M3M3:ECBSF:5022:9:7:0:2,VSW-M3M3:ECBSF:5022:9:7:0:3,VSW-M3M3:ECBSF:5022:9:7:0:4,DIFF{VSW-M3M3:ECBSF:5022:9:7:0:0;-0.0305226445198059},DIFF{VSW-M3M3:ECBSF:5022:9:7:0:1;-0.0305470526218414},DIFF{VSW-M3M3:ECBSF:5022:9:7:0:2;-0.0306599736213684},DIFF{VSW-M3M3:ECBSF:5022:9:7:0:3;-0.007231593132019},DIFF{VSW-M3M3:ECBSF:5022:9:7:0:4;-0.0304692387580872},SWVL2-M3M3:SMARTMET:5015&starttime=${modifiedStartDate}&endtime=${modifiedEndDate}&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc&format=json`
    const response = yield call(axios.get, url)
    if(response.status === 200) {
     const wetness = response.data
      yield put(actions.setSoilWetnessData(wetness))
      }
    } catch (error) {
      if(axios.isAxiosError(error)){
        const errorMessage: any = [{
          message: error.message
        }]
        console.log(errorMessage)
        yield put(actions.setSoilWetnessData(errorMessage))
      }
    } 
  }


  export function* fetchSnowHeightDataSaga ({ payload }: ReturnType<typeof actions.setSnowHeightData>): SagaIterator {
    const startEndTimeSpan = yield select((state: RootState) => state.global.startEndTimeSpan)
    const start_time = new Date(startEndTimeSpan.start_time).toLocaleDateString().split('/')
    const end_time = new Date(startEndTimeSpan.end_time).toLocaleDateString().split('/')
    const modifiedStartDate = Number(`${start_time[2]}${start_time[1]}${start_time[0]}0000`)
    const modifiedEndDate =  Number(`${end_time[2]}${end_time[1]}${end_time[0]}0000`)
    try {
      const url = `https://desm.harvesterseasons.com/timeseries?latlon=64,27&param=utctime,SD-M:ECBSF::1:0:1:0,SD-M:ECBSF::1:0:3:1,SD-M:ECBSF::1:0:3:2,SD-M:ECBSF::1:0:3:3,SD-M:ECBSF::1:0:3:4,DIFF{SD-M:ECBSF::1:0:1:0;-0.0640000104904175},DIFF{SD-M:ECBSF::1:0:3:1;-0.0640000104904175},DIFF{SD-M:ECBSF::1:0:3:2;0.0141249895095825},DIFF{SD-M:ECBSF::1:0:3:3;-0.0640000104904175},DIFF{SD-M:ECBSF::1:0:3:4;-0.0171250104904175},HSNOW-M:SMARTOBS:13:4&starttime=${modifiedStartDate}&endtime=${modifiedEndDate}&timestep=1440&timeformat=xml&precision=full&source=grid&tz=utc&format=json`
     const response = yield call(axios.get, url)
     if(response.status === 200) {
       const snowHeight = response.data
       yield put(actions.setSnowHeightData(snowHeight))
       }
     } catch (error ) {
      if(axios.isAxiosError(error)){
        const errorMessage: string | [] = error.message
        console.log(errorMessage)
        // yield put(actions.setSnowHeightData(errorMessage))
      }
      }
     }
  

  export function* watchHarvesterRequests(): SagaIterator {
    yield takeLatest(actions.setCheckedButton.type, triggerCheckUpdate)
    yield takeLatest(constants.TRAFFICABILITY_API, fetchTrafficabilityDataSaga)
    yield takeLatest(constants.SOILWETNESS_API,fetchSoilWetnessDataSaga)
    yield takeLatest(constants.SOILTEMPERATUE_API,soilTemperatureDataSaga)
    yield takeLatest(constants.SNOWHEIGHT_API, fetchSnowHeightDataSaga)
}
