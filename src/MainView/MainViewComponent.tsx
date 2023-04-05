import { useState, useEffect } from 'react'
import { Container, Box } from '@mui/material'
import GeoJSON from 'ol/format/GeoJSON';
import * as olSource from "ol/source"
import { useAppSelector } from '../store/hooks'
import MapComponent from '../MapComponent/MapComponent'
import HeadingComponent from '../HeadingCompnent/HeadingComponent'
import GraphComponent from '../GraphComponent/GraphComponent'
import Layer from '../Layers/Layers'
import Maastokartta from '../Layers/Maastokartta'
import Thunderforest from '../Layers/Thunderforest'
import Taustakartta from '../Layers/Taustakartta'
import TileLayer from '../Layers/TileLayer'
import XYZ from 'ol/source/XYZ'
import VectorSource from 'ol/source/Vector';
import axios from 'axios'
import '../Map.css'

function MainViewComponent() {
  const [graphData, setGraphData] = useState<[]>([])
  const [graphDataTwo, setGraphDataTwo] = useState<[]>([])
  const [graphDataThree, setGraphDataThree] = useState<[]>([])
  const [summer, setSummer] = useState<string>('')
  const [yValueForGraphTwo, setYValueForGraphTwo] = useState('')
  const mapState = useAppSelector(state => state.mapState)
  
  let lon = mapState.position.lon
  let lat = mapState.position.lat

    // latlon=64,27
  useEffect(() => {
  let url: string;
  const graphData = async () => {  
    if(lon > 0 && lat > 0){
    url = `https://sm.harvesterseasons.com/timeseries?latlon=${lat},${lon}&param=utctime,VSW-M3M3:ECBSF:5022:9:7:0:0,VSW-M3M3:ECBSF:5022:9:7:0:1,
    VSW-M3M3:ECBSF:5022:9:7:0:2,VSW-M3M3:ECBSF:5022:9:7:0:3,VSW-M3M3:ECBSF:5022:9:7:0:4,DIFF{VSW-M3M3:ECBSF:5022:9:7:0:0;-0.0305226445198059},
    DIFF{VSW-M3M3:ECBSF:5022:9:7:0:1;-0.0305470526218414},
    DIFF{VSW-M3M3:ECBSF:5022:9:7:0:2;-0.0306599736213684},DIFF{VSW-M3M3:ECBSF:5022:9:7:0:3;-0.007231593132019},DIFF{VSW-M3M3:ECBSF:5022:9:7:0:4;-0.0304692387580872},
    SWVL2-M3M3:SMARTMET:5015&starttime=202303020000&endtime=202310040000&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc&format=json`
    }

    try{
      if(url){
        await axios
        .get(url)
        .then((response) => {
          if(response.status === 200)
          setGraphData(response.data)
        }).catch((err) => console.log(err));
      }
    } catch (error){
      console.log('try and catch error')
    }
  }

  const graphDataTwo = async () => {
    if(lon > 0 && lat > 0){
      url = `https://sm.harvesterseasons.com/timeseries?latlon=${lat},${lon}&param=utctime,DIFF{SD-M:ECBSF::1:0:1:0;HSNOW-M:SMARTOBS:13:4}
    ,DIFF{SD-M:ECBSF::1:0:3:1;HSNOW-M:SMARTOBS:13:4},DIFF{SD-M:ECBSF::1:0:3:2;HSNOW-M:SMARTOBS:13:4},DIFF{SD-M:ECBSF::1:0:3:3;HSNOW-M:SMARTOBS:13:4},
    DIFF{SD-M:ECBSF::1:0:3:4;HSNOW-M:SMARTOBS:13:4}
    &starttime=20230310T000000Z&endtime=202303200000&timestep=1440&format=json&precision=full&tz=utc&timeformat=xml
    `}
    try{
      await axios
      .get(url)
      .then((response) => setGraphDataTwo(response.data))
      .catch((err) => console.log(err));
    } catch (error){
      console.log('try and catch error', error)
    }
  }
  graphData()
  graphDataTwo()

  console.log(import.meta.env.VITE_API_KEY) 


  },[lon, lat])
 
  const optionDataOne = {
    color: ['green', 'blue' ],
    dataset: {
    source: [
      ["type",...graphData.map((d: any) => d.utctime.split(' ')[0])],
      [`${summer}` ? `${summer}` : 'Summer Index', ...graphData.map((data: any) => data['DIFF{VSW-M3M3:ECBSF:5022:9:7:0:0;-0.0305226445198059}'] )],
      ["Winter Index", ...graphData.map((data: any) => data['VSW-M3M3:ECBSF:5022:9:7:0:0'])],
    ]
  },
  legend: {},
 
  tooltip: {
    trigger: 'axis'
  },
  yAxis: {
    name: 'Traficability'
  },
  xAxis: {
    type: "category",
    axisTick: {
      show: false
    }
  },
  series: [{
    type: "line",
    seriesLayoutBy: "row",
  },
  {
    type: "line",
    seriesLayoutBy: "row"
  }]
  }

  const optionDataTwo = {
    color: ['green', 'blue' ],
    dataset: {
    source: graphDataTwo && [
      ["type",...graphDataTwo.map((d: any) => d.utctime.split('T')[0])],
      [`${yValueForGraphTwo}` && `${yValueForGraphTwo}` , ...graphDataTwo.map((data: any) => {
        data['DIFF{SD-M:ECBSF::1:0:1:0;HSNOW-M:SMARTOBS:13:4}']
      })],
      [`${yValueForGraphTwo}` && `${yValueForGraphTwo}`, ...graphDataTwo.map((data: any) => data['DIFF{SD-M:ECBSF::1:0:1:0;HSNOW-M:SMARTOBS:13:4}'])],
    ]
  },
  legend: {},
 
  tooltip: {
    trigger: 'axis'
  },
  yAxis: {
    name: 'Traficability'
  },
  xAxis: {
    type: "category",
    axisTick: {
      show: false
    }
  },
  series: [{
    type: "line",
    seriesLayoutBy: "row",
  },
  {
    type: "line",
    seriesLayoutBy: "row"
  }]
  }

  const onMouseover = (event: any, echarts: any) => { 
    setSummer(event.data[1])
  };

  const onGlobalout = (event: any, echarts: any) => {
    setSummer('')
  }

  return (
    <div>
      <Container maxWidth="lg">
        <br/>
        <HeadingComponent />
        <br/>
        <Box>
        {graphData.length > 0 ?
          <GraphComponent 
            option={optionDataOne} 
            onEvents={{
              'mouseover': onMouseover,
              'globalout': onGlobalout,
            }} 
          /> 
         :
          <Box sx={{textAlign: 'center', marginBottom: '4rem'}}>...Loading graph data</Box>
          }
        </Box>
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
            }))} />
            <Thunderforest source={new XYZ({
              url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
              attributions: '<a href="https://www.thunderforest.com/">Thunderforest</a> Data by <a href="https://www.fmi.fi/">Finnish Meteorological Institute</a>',
            })} />
           
          </Layer>
        </MapComponent>
        <Box sx={{marginTop: '2rem'}}>
        {graphDataTwo.length > 0 ?
          <GraphComponent 
            option={optionDataTwo} 
            onEvents={{
              'mouseover': (event: any) => setYValueForGraphTwo(event.data[1]),
              'globalout': (event: any) => setYValueForGraphTwo(''),
            }} 
          /> 
         :
          <Box sx={{textAlign: 'center', marginTop: '4rem'}}>...Loading graph data</Box>
          }
        </Box>
      </Container>
    </div>
  )
}

export default MainViewComponent
