import { useState, useEffect } from 'react'
import { Container, Box } from '@mui/material'
import * as olSource from "ol/source"
import { useAppSelector } from '../store/hooks'
import MapComponent from '../MapComponent/MapComponent'
import HeadingComponent from '../HeadingCompnent/HeadingComponent'
import BaseControl from '../Controls/BaseControl'
import GraphComponent from '../GraphComponent/GraphComponent'
import Layer from '../Layers/Layers'
import TileLayer from '../Layers/TileLayers'
import axios from 'axios'
import '../Map.css'

function MainViewComponent() {
  const [graphData, setGraphData] = useState<[]>([])
  const [summer, setSummer] = useState<string>('')
  const mapState = useAppSelector(state => state.mapState)

  const SHensemble = "SD-M:ECBSF::1:0:1:0";
  const param1="utctime";
  const param2="HARVIDX{0.4;VSW-M3M3:ECBSF:5022:9:7:0:1-50;VSW-M3M3:ECBSF:5022:9:7:0:0}";
  const param3="HARVIDX{273;TSOIL-K:ECBSF:::7:3:1-50;TSOIL-K:ECBSF:::7:1:0}";
  const param4="ensover{0.4;0.9;SD-M:ECBSF::1:0:3:1-50;SD-M:ECBSF::1:0:1:0}";
  const SWensemble2 = "DIFF{VSW-M3M3:ECBSF:5022:9:7:0:0;SWVL2-M3M3:SMARTMET:5015}";
  let SHensemble2 = "DIFF{SD-M:ECBSF::1:0:1:0;HSNOW-M:SMARTOBS:13:4}";
  const param5 = "HARVIDX{0.4;SWVL2-M3M3:SMARTMET:5015}";
  const param6 = "HARVIDX{-0.7;STL1-K:SMARTMET}";
  const param7 = "ensover{0.4;0.9;SD-M:SMARTMET:5027}";
  const param8 = "ensover{0.4;0.9;HSNOW-M:SMARTOBS:13:4}";
  const latlonPoint = "64.22728,27.72846"
  const now = new Date();

  let lon = mapState.position.lon
  let lat = mapState.position.lat

    // latlon=64,27
  useEffect(() => {
    try {
      if(lon > 0 && lat > 0){
        const url = `https://sm.harvesterseasons.com/timeseries?latlon=${lat},${lon}&param=utctime,VSW-M3M3:ECBSF:5022:9:7:0:0,VSW-M3M3:ECBSF:5022:9:7:0:1,
        VSW-M3M3:ECBSF:5022:9:7:0:2,VSW-M3M3:ECBSF:5022:9:7:0:3,VSW-M3M3:ECBSF:5022:9:7:0:4,DIFF{VSW-M3M3:ECBSF:5022:9:7:0:0;-0.0305226445198059},
        DIFF{VSW-M3M3:ECBSF:5022:9:7:0:1;-0.0305470526218414},
        DIFF{VSW-M3M3:ECBSF:5022:9:7:0:2;-0.0306599736213684},DIFF{VSW-M3M3:ECBSF:5022:9:7:0:3;-0.007231593132019},DIFF{VSW-M3M3:ECBSF:5022:9:7:0:4;-0.0304692387580872},
        SWVL2-M3M3:SMARTMET:5015&starttime=202303020000&endtime=202310040000&timestep=1440&timeformat=sql&precision=full&separator=,&source=grid&tz=utc&format=json`
  
        axios.get(url).then((response) => {
          if(response.status === 200){
            const g = response.data
            setGraphData(g)
          }
        })
        .catch((error) => {
          console.log(error.message, 'axios error')
        })
      }
     
   
  } catch (error) {
    console.error( error)
  }
  },[lon, lat])
 
  const option = {
    color: ['green', 'blue' ],
    dataset: {
    source: [
      ["type",...graphData.map((d: any) => d.utctime.split(' ')[0])],
      [`${summer}` ? `${summer}` : 'Summer Index', ...graphData.map((data: any) => data['DIFF{VSW-M3M3:ECBSF:5022:9:7:0:0;-0.0305226445198059}'])],
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
            option={option} 
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
          {/* <BaseControl /> */}
          <Layer>
            <TileLayer zIndex={0} sources={{
              source: new olSource.OSM(),
              title: 'base',
              name: 'base',
            }}  />
          </Layer>
        </MapComponent>
        <GraphComponent option={{}} onEvents={{}}  />
      </Container>
    </div>
  )
}

export default MainViewComponent
