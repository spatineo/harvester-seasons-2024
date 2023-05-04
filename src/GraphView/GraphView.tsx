import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useAppSelector } from '../store/hooks'
import { RootState } from '../store/store'
import HarvesterSeasons from '../HarvesterChartComponent/HarvesterSeasons'

const Graphs = () => {
  const soilTemperatureData = useAppSelector((state: RootState) => state.global.soilTemperatureData)
  const snowHHeightData = useAppSelector((state: RootState) => state.global.snowHeight)
  const soilWetnessData = useAppSelector((state: RootState) => state.global.soilWetnessData)
  const [data, setData] = useState<{soilWetness: [],soilTemperature: [], snowHeight: []}>({soilWetness: [], soilTemperature: [], snowHeight: []})
  const [error, setError] = useState<string>('')
  const dateMarker = new Date().toDateString()

  useEffect(() => {
    if(!soilTemperatureData && snowHHeightData && soilTemperatureData) return;
      setData({
        soilWetness: soilWetnessData,
        soilTemperature: soilTemperatureData,
        snowHeight: snowHHeightData
      })
  }, [soilTemperatureData, soilWetnessData, snowHHeightData])

  const soilWetnessDate = () => {
      return data.soilWetness.map((d: any) => {
        const modifiedDate = new Date(d.utctime).toDateString()
        return modifiedDate.substring(3)
      })
    
  }

  const soilWetnessOption =  {
    symbol: 'none',
    dataset: {
      source: [
        [...soilWetnessDate()],
        [...data.soilWetness.map((data: any) => data['DIFF{VSW-M3M3:ECBSF:5022:9:7:0:0;-0.0305226445198059}'])],
        [...data.soilWetness.map((data: any) => data['DIFF{VSW-M3M3:ECBSF:5022:9:7:0:1;-0.0305470526218414}'])],
        [...data.soilWetness.map((data: any) => data['DIFF{VSW-M3M3:ECBSF:5022:9:7:0:2;-0.0306599736213684}'])],
        [...data.soilWetness.map((data: any) => data['DIFF{VSW-M3M3:ECBSF:5022:9:7:0:3; -0.007231593132019}'])],
        [...data.soilWetness.map((data: any) => data['DIFF{VSW-M3M3:ECBSF:5022:9:7:0:4;-0.0304692387580872}'])],
        [...data.soilWetness.map((data: any) => data['SWVL2-M3M3:SMARTMET:5015'])],
        [...data.soilWetness.map((data: any) => data['VSW-M3M3:ECBSF:5022:9:7:0:0'])],
        [...data.soilWetness.map((data: any) => data['VSW-M3M3:ECBSF:5022:9:7:0:1'])],
        [...data.soilWetness.map((data: any) => data['VSW-M3M3:ECBSF:5022:9:7:0:2'])],
        [...data.soilWetness.map((data: any) => data['VSW-M3M3:ECBSF:5022:9:7:0:3'])],
        [...data.soilWetness.map((data: any) => data['VSW-M3M3:ECBSF:5022:9:7:0:4'])],
      ]
    },
    legend: {},
    grid: {
    },
    tooltip: {
      show: false,
      trigger: 'axis'
    },
    yAxis: {
      name: 'Soil Wetness (m³/m³)',
      nameLocation: 'middle',
      nameTextStyle: {
        padding: 20
      }
    },
    xAxis: {
      type: "category",
      axisTick: {
        show: false
      }
    },
    series: [{
      label: null,
      type: "line",
      seriesLayoutBy: "row",
      markLine: {
        data: [
          {
            xAxis: dateMarker.substring(3), name: '', type: 'min',  label: {show: false},
          }],
        symbol: 'none',
        lineStyle: {
          type: 'solid',
          width: 3,
          arrow: 'none',
        },
      },
    },
    {
      type: "line",
      seriesLayoutBy: "row",
    },
    {
      type: "line",
      seriesLayoutBy: "row",
    },
    {
      type: "line",
      seriesLayoutBy: "row",
    },
    {
      type: "line",
      seriesLayoutBy: "row",
    },
    {
      type: "line",
      seriesLayoutBy: "row",
    },
    {
      type: "line",
      seriesLayoutBy: "row",
    },
    {
      type: "line",
      seriesLayoutBy: "row",
    },
    {
      type: "line",
      seriesLayoutBy: "row",
    },
    {
      type: "line",
      seriesLayoutBy: "row",
    },
    {
      type: "line",
      seriesLayoutBy: "row",
    },]
  }

  const soilSourceData = () => {
    let source: any[] = []
      source = [
        [...data.soilTemperature.map((d: any) => {
          const modifiedDate = new Date(d.utctime).toDateString()
          return modifiedDate.substring(3)
        })],
        [...data.soilTemperature.map((d: any) =>  d['K2C{TSOIL-K:ECBSF:::7:1:0}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:1}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:1}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:2}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:2}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:4}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:5}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:6}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:7}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:8}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:9}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:10}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:11}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:12}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:13}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:14}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:15}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:16}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:17}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:18}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:19}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:20}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:21}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:22}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:23}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:24}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:25}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:26}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:27}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:28}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:29}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:30}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:31}'])],
        [...data.soilTemperature.map((d: any) => d['K2C{TSOIL-K:ECBSF:::7:3:32}'])]
      ]

    return source
  }

  const soilTemperatureOption = {
    dataset: {
      source: soilSourceData()
    },
    legend: {
      type: 'scroll',
      show: false,
      bottom: 200

    },
      grid: {
        
      },
      tooltip: {
        show: false,
        trigger: 'axis'
      },
      yAxis: {
        name: 'Soil Temperature (°C)',
        nameLocation: 'middle',
        nameTextStyle: {
          padding: 14
        }
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
        
        markLine: {
          data: [
            {
              xAxis: dateMarker.substring(3), name: '', type: 'min',  label: {show: false},
            }],
          symbol: 'none',
          lineStyle: {
            type: 'solid',
            width: 3,
            arrow: 'none',
          },
        },
        
      },
      {
        type: "line",
        seriesLayoutBy: "row",
        name: 'Temperature'
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
    ]
  }

  const snowHHeightSource = () => {
    return [
      [...data.snowHeight.map((snow: {utctime: string}) => {
       /*  const date = new Date(snow['utctime']);
        const formattedDate = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        console.log(formattedDate) */

        const modifiedDate = new Date(snow.utctime).toDateString()
        return modifiedDate.substring(3)
      })],
      [...data.snowHeight.map((snow: any) => snow['DIFF{VSW-M3M3:ECBSF:5022:9:7:0:0;-0.0305226445198059}'])],
      [...data.snowHeight.map((snow: any) => snow['DIFF{VSW-M3M3:ECBSF:5022:9:7:0:1;-0.0305470526218414}'])],
      [...data.snowHeight.map((snow: any) => snow['DIFF{VSW-M3M3:ECBSF:5022:9:7:0:2;-0.0306599736213684}'])],
      [...data.snowHeight.map((snow: any) => snow['DIFF{VSW-M3M3:ECBSF:5022:9:7:0:3;-0.007231593132019}'])],
      [...data.snowHeight.map((snow: any) => snow['DIFF{VSW-M3M3:ECBSF:5022:9:7:0:4;-0.0304692387580872}'])],
      [...data.snowHeight.map((snow: any) => snow['SWVL2-M3M3:SMARTMET:5015'])],
      [...data.snowHeight.map((snow: any) => snow['VSW-M3M3:ECBSF:5022:9:7:0:0'])],
      [...data.snowHeight.map((snow: any) => snow['VSW-M3M3:ECBSF:5022:9:7:0:1'])],
      [...data.snowHeight.map((snow: any) => snow['VSW-M3M3:ECBSF:5022:9:7:0:2'])],
      [...data.snowHeight.map((snow: any) => snow['VSW-M3M3:ECBSF:5022:9:7:0:3'])],
      [...data.snowHeight.map((snow: any) => snow['VSW-M3M3:ECBSF:5022:9:7:0:4'])],
    ]
  }


  const snowHeightOption = {
    dataset: {
      source: snowHHeightSource()
    },
    legend: null,
      grid: {
        
      },
      tooltip: {
        show: false,
        trigger: 'axis'
      },
      yAxis: {
        name: 'Snow Height (m)',
        nameLocation: 'middle',
        nameTextStyle: {
          padding: 14
        }
      },
      xAxis: {
        type: "category",
        axisTick: {
          show: false
        }
      }, 
      series: [{
        label: {
          show: false
        },
        type: "line",
        seriesLayoutBy: "row",
        markLine: {
          data: [
            {
              xAxis: dateMarker.substring(3), name: '', type: 'min',  label: {show: false},
            }],
          symbol: 'none',
          lineStyle: {
            type: 'solid',
            width: 3,
            arrow: 'none',
          },
        },
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
      {
        type: "line",
        seriesLayoutBy: "row",
      },
    ],
  };

  const seriesData = [820, 932, 901, 934, 1290, 1330]
  const lastItem = seriesData.at(seriesData.length -1)
 
   /* const M = () => {
    return <ReactECharts
      option={trafficabilityOptionData} 
      onChartReady={() => ''} 
      theme="" 
      onEvents={{}}
    />;
  }
  const TrafficGraph = withLogging(M) */
  const soilTemperatureGraph = () => {
    if(error !== ''){
      return (
        <Box>
          <Typography sx={{fontFamily: 'Lato'}}>Soil Temperature graph is not available!</Typography>
        </Box>
      )
    } else {
      return <div>
          <HarvesterSeasons 
          parameters={[]}
          data={data.soilWetness} 
          starttime={0} 
          endtime={0} 
          timestep={0} 
          option={soilWetnessOption} 
          handleClick={(data) => console.log('click', data) }
         />
           <HarvesterSeasons 
          parameters={[]} 
          data={data.soilTemperature} 
          starttime={0} 
          endtime={0} 
          timestep={0} 
          option={soilTemperatureOption} 
          handleClick={() => console.log('click') }
         />
        <HarvesterSeasons 
          parameters={[]} 
          data={data.snowHeight} 
          starttime={0} 
          endtime={0} 
          timestep={0} 
          option={snowHeightOption} 
          handleClick={(data: any) => console.log('click', data.event.offsetX) }
         />

      </div>
    }
  }
 
  return (
    <Box>
     {soilTemperatureGraph()}
    </Box>
  )
}

export default Graphs