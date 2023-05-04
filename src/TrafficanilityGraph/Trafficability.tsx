import React, { useState, FC, useEffect, useRef} from 'react'
import * as echarts from "echarts"
import { EChartOption  } from 'echarts'
import { Box, Typography } from '@mui/material'
import GraphComponent from '../GraphComponent/GraphComponent'
import { useAppSelector } from '../store/hooks'
import { RootState } from '../store/store'

const TraficabilityGraphComponent: FC = () => {
  const graphRef= useRef<HTMLDivElement>(null)
  const [summer, setSummer] = useState<string>('')
  const [winter, setWinter] = useState<string>('')
  const trafficability = useAppSelector((state: RootState) => state.global.trafficabilityData)

  useEffect(() => {
    if(!graphRef.current && !trafficability) {
      throw Error('No graph ref available')
    }
    const graph = echarts.init(graphRef.current!, undefined, {
      height: '180',
    })

    const trafficabilityDate = () => {
      return trafficability.map((traffic: {[key: string]: string | number}) => {
       /*  const date = new Date(traffic.utctime).toUTCString()
        return date.substring(7, 17) */
        const modifiedDate = new Date(traffic.utctime).toDateString()
        return modifiedDate.substring(3)
      })
    }

    const trafficabilityOptionData: EChartOption = {
      dataset: {
      source: [
        [...trafficabilityDate()],
        [`${summer}` ? `${summer} summer` : 'Summer Index', ...summerIndex()],
        [`${winter}` ? `${winter} winter` : "Winter Index", ...winterIndex1()],
      ]
    },
    legend: {},
    grid: {
      height: '80px'
    },
    tooltip: {
      trigger: 'axis'
    },
    yAxis: {
      name: 'Traficability',
      nameLocation: 'middle',
      nameTextStyle: {
        padding: 18
      }
    },
    xAxis: {
      type: "category",
      axisLabel: {
        //formatter: (d: any) => moment(d).format('DD.MM'),
       // interval: 24,
      },
    },
    series: [{
      type: "line",
      seriesLayoutBy: "row",
      areaStyle: {
        color: 'rgb(192, 203, 204)'
      }
    },
    {
      type: "line",
      seriesLayoutBy: "row",
     
    }]
    }
  
    
    graph.setOption(trafficabilityOptionData)
  
    
    graph.getZr().on('click', function(params){
      console.log(params)
      var pointInPixel = [params.offsetX, params.offsetY];
      var pointInGrid = graph.convertFromPixel({gridIndex: 0}, pointInPixel);
      const xAxis = graph.getOption().xAxis;
      const xAxisData = (Array.isArray(xAxis) ? xAxis[0] : xAxis)?.data
      const xValue = xAxisData !== undefined && xAxisData[pointInGrid[0]];
      console.log(xAxisData)
      console.log(`Clicked on x-axis value ${xValue}`);
    })

    return () => {
      if(graph){
        graph.dispose()
      }
    }
  }, [graphRef, trafficability])

  const trafficabilityDate = () => {
      return trafficability.map((traffic: {[key: string]: string | number}) => {
       /*  const date = new Date(traffic.utctime).toUTCString()
        return date.substring(7, 17) */
        const modifiedDate = new Date(traffic.utctime).toDateString()
        return modifiedDate.substring(3)
      })
    }

  const summerIndex = () => {
    if(typeof trafficability === 'string') {
      /* return trafficability.map((data: any) => {
        if(data['HARVIDX{273;TSOIL-K:ECBSF:::7:3:1-50;TSOIL-K:ECBSF:::7:1:0}'] === null){
          return 'nan'
        } else {
          return data['HARVIDX{273;TSOIL-K:ECBSF:::7:3:1-50;TSOIL-K:ECBSF:::7:1:0}'] 
        }
      } ) */
      return ''
    } else {
      return trafficability.map((summer1Data: any) => {
        let param = 'ensover{0.4;0.9;SD-M:SMARTMET:5027}'
      })
    }
   }
   const winterIndex1 = () => {
    if(typeof trafficability === 'string') {
      /* return trafficability.map((data: any) => {
        if(data['HARVIDX{-0.7;STL1-K:SMARTMET}'] === null){
          return 0
        } else {
          return data['HARVIDX{-0.7;STL1-K:SMARTMET}']
        } 
      }
        ) */
        return ''
    } else {
      return trafficability.map((winterData: any) => {
        let winter1
        let param3 = 'HARVIDX{273;TSOIL-K:ECBSF:::7:3:1-50;TSOIL-K:ECBSF:::7:1:0}'
        let param8 = 'ensover{0.4;0.9;HSNOW-M:SMARTOBS:13:4}'
        let param4ensemble = 
        `ensover{0.4;0.9;DIFF{SD-M:ECBSF::1:0:1:0;-0.2220000624656677};DIFF{SD-M:ECBSF::1:0:3:1;-0.3626250624656677};
        DIFF{SD-M:ECBSF::1:0:3:2;-0.2845000624656677};DIFF{SD-M:ECBSF::1:0:3:3;-0.2532500624656677};DIFF{SD-M:ECBSF::1:0:3:4;-0.2220000624656677};
        DIFF{SD-M:ECBSF::1:0:3:5;-0.3782500624656677};DIFF{SD-M:ECBSF::1:0:3:6;-0.2376250624656677};DIFF{SD-M:ECBSF::1:0:3:7;-0.3938750624656677};
        DIFF{SD-M:ECBSF::1:0:3:8;-0.3001250624656677};DIFF{SD-M:ECBSF::1:0:3:9;-0.4876250624656677};DIFF{SD-M:ECBSF::1:0:3:10;-0.2532500624656677};
        DIFF{SD-M:ECBSF::1:0:3:11;-0.2688750624656677};DIFF{SD-M:ECBSF::1:0:3:12;-0.2063750624656677};DIFF{SD-M:ECBSF::1:0:3:13;-0.3313750624656677};
        DIFF{SD-M:ECBSF::1:0:3:14;-0.3626250624656677};DIFF{SD-M:ECBSF::1:0:3:15;-0.2688750624656677};DIFF{SD-M:ECBSF::1:0:3:16;-0.2220000624656677};
        DIFF{SD-M:ECBSF::1:0:3:17;-0.2845000624656677};DIFF{SD-M:ECBSF::1:0:3:18;-0.3313750624656677};DIFF{SD-M:ECBSF::1:0:3:19;-0.3470000624656677};
        DIFF{SD-M:ECBSF::1:0:3:20;-0.3470000624656677};DIFF{SD-M:ECBSF::1:0:3:21;-0.4251250624656677};DIFF{SD-M:ECBSF::1:0:3:22;-0.1751250624656677};
        DIFF{SD-M:ECBSF::1:0:3:23;-0.4251250624656677};DIFF{SD-M:ECBSF::1:0:3:24;-0.4720000624656677};DIFF{SD-M:ECBSF::1:0:3:25;-0.3470000624656677};
        DIFF{SD-M:ECBSF::1:0:3:26;-0.1438750624656677};DIFF{SD-M:ECBSF::1:0:3:27;-0.2845000624656677};DIFF{SD-M:ECBSF::1:0:3:28;-0.2845000624656677};
        DIFF{SD-M:ECBSF::1:0:3:29;-0.1751250624656677};DIFF{SD-M:ECBSF::1:0:3:30;-0.2063750624656677};DIFF{SD-M:ECBSF::1:0:3:31;-0.0813750624656677};
        DIFF{SD-M:ECBSF::1:0:3:32;-0.1438750624656677};DIFF{SD-M:ECBSF::1:0:3:33;-0.4095000624656677};DIFF{SD-M:ECBSF::1:0:3:34;-0.2532500624656677};
        DIFF{SD-M:ECBSF::1:0:3:35;-0.4720000624656677};DIFF{SD-M:ECBSF::1:0:3:36;-0.2063750624656677};DIFF{SD-M:ECBSF::1:0:3:37;-0.3938750624656677};
        DIFF{SD-M:ECBSF::1:0:3:38;-0.3157500624656677};DIFF{SD-M:ECBSF::1:0:3:39;-0.1751250624656677};DIFF{SD-M:ECBSF::1:0:3:40;-0.4407500624656677};
        DIFF{SD-M:ECBSF::1:0:3:41;-0.2688750624656677};DIFF{SD-M:ECBSF::1:0:3:42;-0.3470000624656677};DIFF{SD-M:ECBSF::1:0:3:43;-0.2845000624656677};
        DIFF{SD-M:ECBSF::1:0:3:44;-0.3782500624656677};DIFF{SD-M:ECBSF::1:0:3:45;-0.1751250624656677};DIFF{SD-M:ECBSF::1:0:3:46;-0.3470000624656677};
        DIFF{SD-M:ECBSF::1:0:3:47;-0.4563750624656677};DIFF{SD-M:ECBSF::1:0:3:48;-0.2845000624656677};DIFF{SD-M:ECBSF::1:0:3:49;-0.3157500624656677};
        DIFF{SD-M:ECBSF::1:0:3:50;-0.3157500624656677}}`
        if (winterData[param8] !== null) { 
          winter1 = Math.max(winterData[param3], winterData[param8]);
         } else if (winterData[param3] !== null || winterData[param4ensemble] !== null) {
          winter1 = Math.max(winterData[param3], winterData[param4ensemble]); }
         else { winter1 = 'nan'; }
         return winter1
      })
    }
   }
  
  const trafficabilityOptionData = {
    dataset: {
    source: [
      ["type", ...trafficabilityDate()],
      [`${summer}` ? `${summer} summer` : 'Summer Index', ...summerIndex()],
      [`${winter}` ? `${winter} winter` : "Winter Index", ...winterIndex1()],
    ]
  },
  legend: {},
  grid: {
    height: '80px'
  },
  tooltip: {
    trigger: 'axis'
  },
  yAxis: {
    name: 'Traficability',
    nameLocation: 'middle',
    nameTextStyle: {
      padding: 18
    }
  },
  xAxis: {
    type: "category",
  },
  series: [{
    type: "line",
    seriesLayoutBy: "row",
    areaStyle: {
      color: 'rgb(192, 203, 204)'
    }
  },
  {
    type: "line",
    seriesLayoutBy: "row",
   
  }]
  }

  const trafficabilityGraph = () => {
  
    return (
      <Box>
        <Box ref={graphRef}>
        </Box>
       {/*  <GraphComponent 
          option={trafficabilityOptionData} 
          onEvents={{
            mouseover: (event: any) => { 
              setWinter(event.data[2])
              setSummer(event.data[1])  
            },
            mouseout: (event: any) => {
              setSummer('')
              setWinter('')
            },
            click: (event: any) => {
              console.log(event)
            }
          }} 
      /> */}
      </Box>
    )
  }

  return (
    <Box>
      {trafficabilityGraph()}
    </Box>
  )
}

export default TraficabilityGraphComponent