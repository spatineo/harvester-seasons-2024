import React, { useState, useEffect } from 'react'
import { Container, Box } from '@mui/material'
import GeoJSON from 'ol/format/GeoJSON'
import * as olSource from "ol/source"
import { useAppSelector, useRootDispatch } from '../store/hooks'
import { RootState } from '../store/store'
import MapComponent from '../MapComponent/MapComponent'
import HeadingComponent from '../HeadingCompnent/HeadingComponent'
import Layer from '../Layers/Layers'
import Maastokartta from '../Layers/Maastokartta'
import Thunderforest from '../Layers/Thunderforest'
import Taustakartta from '../Layers/Taustakartta'
import TileLayer from '../Layers/TileLayer'
import XYZ from 'ol/source/XYZ'
import VectorSource from 'ol/source/Vector'
import TraficabilityGraph from '../TrafficanilityGraph/Trafficability'
import GraphView from '../GraphView/GraphView'
import FooterComponent from '../FooterComponent/FooterComponent'
import SwitchComponent from '../SwitchComponent/SwitchComponent'
import * as constants from '../store/constants'
import '../Map.css'
import TimelineSlider from '../TimeLine/TimeLineSlider';

function MainViewComponent() {
  const [year, setYear] = useState<number | number[]>(2000);
  const mapState = useAppSelector((state: RootState)  => state.mapState)
  //const dateFromRedux = useAppSelector((state: RootState) => state.global.globalTimeSearch)

  const dispatch = useRootDispatch()
  let lon = mapState.position.lon
  let lat = mapState.position.lat
 
 /*  const time_start =  dateFromRedux.start_time
  const time_end =  dateFromRedux.end_time
  const time_step = dateFromRedux.time_step
 */
  useEffect(() => {
    dispatch({type: constants.TRAFFICABILITY_API})
    dispatch({type: constants.SOILWETNESS_API})
    dispatch({type: constants.SOILTEMPERATUE_API})
    dispatch({type: constants.SNOWHEIGHT_API})
  },[])

  /* const endDate = new Date(dateFromRedux.end_time).toLocaleDateString().split('/')
  const endDateApi = `${endDate[2]}${endDate[1]}${endDate[0]}0000`
  const dateStart = new Date(dateFromRedux.start_time).toLocaleDateString().split('/')
  const startTimeForAPi = `${dateStart[2]}${dateStart[1]}${dateStart[0]}0000`
 */
/*   useEffect(() => {
    //console.log(import.meta.env.VITE_API_URL) 
  },[
    lon, 
    lat, 
    time_step, 
    time_end,
    time_start
  ]) */

  const handleChange = (value: number | number[]) => {
    setYear(value);
  };


 const timeLineOption = {
  timeline: {
    data: ['2023-04', '2023-05', '2023-06', '2023-7', '2023-08', '2023-9'],
    },
  }

  return (
    <div>
      <Container maxWidth="lg">
        <br/>
        <HeadingComponent />
        <br/>
        <TraficabilityGraph />
        <SwitchComponent />
        <TimelineSlider />
        <MapComponent resolution={mapState.position.resolution} center={[mapState.position.lon, mapState.position.lat]}>
          <Layer>
            <Taustakartta source={new VectorSource({
              attributions: ' <a href="https://www.thunderforest.com/">Thunderforest</a> Data by <a href="https://www.fmi.fi/">Finnish Meteorological Institute</a>',
              url: 'https://openlayers.org/data/vector/ecoregions.json',
              format: new GeoJSON()})} />
            <Maastokartta
              source={
                new olSource.OSM({
                  url: 'https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/maastokartta/default/WGS84_Pseudo-Mercator/{z}/{y}/{x}.png?api-key=45deef08-fd2f-42ae-9953-5550fff43b17',
                  attributions: '<a href="https://www.thunderforest.com/">Thunderforest</a> Data by <a href="https://www.fmi.fi/">Finnish Meteorological Institute</a>',
                  })}
                />
            <TileLayer source={new olSource.OSM(({
              url: 'https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/taustakartta/default/WGS84_Pseudo-Mercator/{z}/{y}/{x}.png?api-key=45deef08-fd2f-42ae-9953-5550fff43b17',
              attributions: '<a href="https://www.thunderforest.com/">Thunderforest</a> Data by <a href="https://www.fmi.fi/">Finnish Meteorological Institute</a>',
              }))}
            />
            <Thunderforest source={new XYZ({
              url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
              attributions: '<a href="https://www.thunderforest.com/">Thunderforest</a> Data by <a href="https://www.fmi.fi/">Finnish Meteorological Institute</a>',
              })}
            />
          </Layer>
        </MapComponent>
        <Box sx={{marginTop: '2rem'}}>
          <GraphView/>
        </Box>
        <Box sx={{marginTop: '2rem'}}>
        </Box>
        <br/>
        <br/>
        <FooterComponent />
      </Container>
    </div>
  )
}
export default MainViewComponent
