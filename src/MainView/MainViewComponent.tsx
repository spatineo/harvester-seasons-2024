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
  const [trafficablityData, setTrafficabilityData] = useState<[]>([])
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
          if(response.status === 200){
          setGraphData(response.data)
          }
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
      .then((response) => {
        setGraphDataTwo(response.data)
      })
      .catch((err) => console.log(err));
    } catch (error){
      console.log('try and catch error', error)
    }
  }

  const trafficablityData = async () => {
    let trafficURL;
    if(lon > 0 && lat > 0){
    trafficURL = `https://sm.harvesterseasons.com/timeseries?latlon=${lat},${lon}&param=utctime,HARVIDX{0.4;
    VSW-M3M3:ECBSF:5022:9:7:0:1-50;VSW-M3M3:ECBSF:5022:9:7:0:0},HARVIDX{273;TSOIL-K:ECBSF:::7:3:1-50;TSOIL-K:ECBSF:::7:1:0},
    ensover{0.4;0.9;DIFF{SD-M:ECBSF::1:0:1:0;-0.0640000104904175};DIFF{SD-M:ECBSF::1:0:3:1;-0.0640000104904175};DIFF{SD-M:ECBSF::1:0:3:2;
      0.0141249895095825};DIFF{SD-M:ECBSF::1:0:3:3;-0.0640000104904175};DIFF{SD-M:ECBSF::1:0:3:4;-0.0171250104904175}},HARVIDX{0.4;
        SWVL2-M3M3:SMARTMET:5015},HARVIDX{-0.7;STL1-K:SMARTMET},ensover{0.4;0.9;SD-M:SMARTMET:5027},ensover{0.4;0.9;
    HSNOW-M:SMARTOBS:13:4}&starttime=202303020000&endtime=202310040000&timestep=1440&format=json&source=grid&timeformat=xml&tz=utc`
    }
    try {
      if(trafficURL){
        await axios.get(trafficURL)
        .then(response => {
          setTrafficabilityData(response.data)
        })
        .catch(error => console.error(error))
      }
    } catch (error) {
      console.log('Error in try and catch', error)
    }
  }

  graphData()
  graphDataTwo()
  trafficablityData()
  
  console.log(import.meta.env.VITE_API_URL) 

  },[lon, lat])
 
  const optionDataOne = {
    color: ['green', 'blue' ],
    dataset: {
    source: [
      ["type",...trafficablityData.map((d: any) => d.utctime.split('T')[0])],
      [`${summer}` ? `${summer}` : 'Summer Index', ...trafficablityData.map((data: any) => {
       
        if(data['HARVIDX{273;TSOIL-K:ECBSF:::7:3:1-50;TSOIL-K:ECBSF:::7:1:0}'] === null){
          return 'nan'
        } else {
          return data['HARVIDX{273;TSOIL-K:ECBSF:::7:3:1-50;TSOIL-K:ECBSF:::7:1:0}'] 
        }
      } )],
      ["Winter Index", ...trafficablityData.map((data: any) => {
        console.log(data['HARVIDX{-0.7;STL1-K:SMARTMET}'])
        if(data['HARVIDX{-0.7;STL1-K:SMARTMET}'] === null){
          return 0
        } else {
          return data['HARVIDX{-0.7;STL1-K:SMARTMET}']
        } 
      }
        )],
    ]
  },
  legend: {},
  grid: {
    height: '80px',
  },
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
    datasetIndex: 0,
    areaStyle: {
      color: 'rgb(192, 203, 204)'
    }
  },
  {
    type: "line",
    seriesLayoutBy: "row",
   
  }]
  }

  const optionDataTwo = {
    color: ['green', 'blue' ],
    dataset: {
    source: graphDataTwo && [
      ["type",...trafficablityData.map((d: any) => d.utctime.split('T')[0])],
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
    datasetIndex: 0,
    areaStyle: {
      color: 'green'
    }
  },
  {
    type: "line",
    seriesLayoutBy: "row",
    datasetIndex: 1,
    areaStyle: {
      color: '#000'
    }
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
/* 



https://sm.harvesterseasons.com/timeseries?latlon=64,27&param=utctime,HARVIDX{0.4;VSW-M3M3:ECBSF:5022:9:7:0:1-50;
VSW-M3M3:ECBSF:5022:9:7:0:0},HARVIDX{273;TSOIL-K:ECBSF:::7:3:1-50;TSOIL-K:ECBSF:::7:1:0},ensover{0.4;0.9;DIFF{SD-M:ECBSF::1:0:1:0;
  -0.3948749899864197};DIFF{SD-M:ECBSF::1:0:3:1;-0.4886249899864197};DIFF{SD-M:ECBSF::1:0:3:2;-0.3948749899864197};
  DIFF{SD-M:ECBSF::1:0:3:3;-0.5042499899864197};DIFF{SD-M:ECBSF::1:0:3:4;-0.5667499899864197};DIFF{SD-M:ECBSF::1:0:3:5;
    -0.5042499899864197};DIFF{SD-M:ECBSF::1:0:3:6;-0.4886249899864197};DIFF{SD-M:ECBSF::1:0:3:7;-0.6292499899864197};DIFF{SD-M:ECBSF::1:0:3:8;
      -0.5354999899864197};DIFF{SD-M:ECBSF::1:0:3:9;-0.5354999899864197};DIFF{SD-M:ECBSF::1:0:3:10;-0.5667499899864197};DIFF{SD-M:ECBSF::1:0:3:11;
        -0.4573749899864197};DIFF{SD-M:ECBSF::1:0:3:12;-0.4886249899864197};DIFF{SD-M:ECBSF::1:0:3:13;-0.5511249899864197};DIFF{SD-M:ECBSF::1:0:3:14;-0.6136249899864197};DIFF{SD-M:ECBSF::1:0:3:15;-0.4729999899864197};DIFF{SD-M:ECBSF::1:0:3:16;-0.5042499899864197};
  DIFF{SD-M:ECBSF::1:0:3:17;-0.4104999899864197};DIFF{SD-M:ECBSF::1:0:3:18;-0.4729999899864197};DIFF{SD-M:ECBSF::1:0:3:19;-0.6448749899864197};DIFF{SD-M:ECBSF::1:0:3:20;-0.4729999899864197};DIFF{SD-M:ECBSF::1:0:3:21;-0.4886249899864197};DIFF{SD-M:ECBSF::1:0:3:22;
    -0.4261249899864197};DIFF{SD-M:ECBSF::1:0:3:23;-0.5042499899864197};DIFF{SD-M:ECBSF::1:0:3:24;-0.5354999899864197};DIFF{SD-M:ECBSF::1:0:3:25;
      -0.5198749899864197};DIFF{SD-M:ECBSF::1:0:3:26;-0.5198749899864197};DIFF{SD-M:ECBSF::1:0:3:27;-0.5198749899864197};DIFF{SD-M:ECBSF::1:0:3:28;
        -0.4573749899864197};DIFF{SD-M:ECBSF::1:0:3:29;-0.4261249899864197};DIFF{SD-M:ECBSF::1:0:3:30;-0.4417499899864197};DIFF{SD-M:ECBSF::1:0:3:31;
          -0.4104999899864197};DIFF{SD-M:ECBSF::1:0:3:32;-0.5042499899864197};DIFF{SD-M:ECBSF::1:0:3:33;-0.6604999899864197};
          DIFF{SD-M:ECBSF::1:0:3:34;-0.5042499899864197};DIFF{SD-M:ECBSF::1:0:3:35;-0.5198749899864197};DIFF{SD-M:ECBSF::1:0:3:36;
            -0.4573749899864197};DIFF{SD-M:ECBSF::1:0:3:37;-0.5667499899864197};DIFF{SD-M:ECBSF::1:0:3:38;-0.4417499899864197};DIFF{SD-M:ECBSF::1:0:3:39;-0.4729999899864197};DIFF{SD-M:ECBSF::1:0:3:40;-0.5042499899864197};DIFF{SD-M:ECBSF::1:0:3:41;-0.5823749899864197};DIFF{SD-M:ECBSF::1:0:3:42;-0.5511249899864197};DIFF{SD-M:ECBSF::1:0:3:43;-0.5042499899864197};DIFF{SD-M:ECBSF::1:0:3:44;-0.5979999899864197};DIFF{SD-M:ECBSF::1:0:3:45;-0.4417499899864197};DIFF{SD-M:ECBSF::1:0:3:46;-0.5979999899864197};DIFF{SD-M:ECBSF::1:0:3:47;-0.5042499899864197};DIFF{SD-M:ECBSF::1:0:3:48;-0.5511249899864197};DIFF{SD-M:ECBSF::1:0:3:49;-0.5823749899864197};DIFF{SD-M:ECBSF::1:0:3:50;-0.5042499899864197}},HARVIDX{0.4;SWVL2-M3M3:SMARTMET:5015},HARVIDX{-0.7;STL1-K:SMARTMET},ensover{0.4;0.9;SD-M:SMARTMET:5027},ensover{0.4;0.9;HSNOW-M:SMARTOBS:13:4}&starttime=
202303020000&endtime=202310040000&timestep=1440&format=json&source=grid&timeformat=xml&tz=utc
*/