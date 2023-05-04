import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useAppSelector } from '../store/hooks'
import { RootState } from '../store/store'
import { Parameter } from '../types';
import HarvesterSeasons from '../HarvesterChartComponent/HarvesterSeasons'

interface GraphOptions {
  title: string
}

const Graphs = () => {
  const soilTemperatureData = useAppSelector((state: RootState) => state.global.soilTemperatureData)
  const snowHeightData = useAppSelector((state: RootState) => state.global.snowHeight)
  const soilWetnessData = useAppSelector((state: RootState) => state.global.soilWetnessData)
  const graphParameters = useAppSelector((state: RootState) => state.global.parameters);


  const [soilWetnessOption, setSoilWetnessOption] = useState<any>(null);
  const [soilTemperatureOption, setSoilTemperatureOption] = useState<any>(null);
  const [snowHeightOption, setSnowHeightOption] = useState<any>(null);

  const [error, setError] = useState<string>('')
  const dateMarker = new Date(new Date().getTime()+1000*60*60*24*7).toDateString()

  function createOptions(opts : GraphOptions, parameters : Parameter[], values : []) {
    const source = () => {
      return [
        [...values.map((value: {utctime: string}) => {
          const modifiedDate = new Date(value.utctime).toDateString()
          return modifiedDate.substring(3)
        })],
        ...parameters.map((p) => {
          return values.map((value) => value[p.code]);
        })
      ]
    }
  
    return {
      dataset: {
        source: source()
      },
      legend: null,
        grid: {
        },
        tooltip: {
          show: false,
          trigger: 'axis'
        },
        yAxis: {
          name: opts.title,
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
        series: [
          {
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
        ...parameters.map((p) => { return {
            type: "line",
            seriesLayoutBy: "row",
          }
        })
      ],
    };
  }

  useEffect(() => {
    if (soilTemperatureData) {
      const tmp = createOptions({title: 'Soil Temperature'}, graphParameters.soilTemperature, soilTemperatureData );
      setSoilTemperatureOption(tmp);
    }
  }, [soilTemperatureData, graphParameters.soilTemperature]);


  useEffect(() => {
    if (soilWetnessData) {
      const tmp = createOptions({title: 'Soil Wetness'}, graphParameters.soilWetness, soilWetnessData );
      setSoilWetnessOption(tmp);
    }
  }, [soilWetnessData, graphParameters.soilWetness]);


  useEffect(() => {
    if (snowHeightData) {
      const tmp = createOptions({title: 'Snow Height'}, graphParameters.snowHeight, snowHeightData );
      setSnowHeightOption(tmp);
    }
  }, [snowHeightData, graphParameters.snowHeight]);

  return <div>
      <HarvesterSeasons 
      option={soilWetnessOption} 
      handleClick={(data) => console.log('click', data) }
      />
        <HarvesterSeasons 
      option={soilTemperatureOption} 
      handleClick={() => console.log('click') }
      />
    <HarvesterSeasons 
      option={snowHeightOption} 
      handleClick={(data: any) => console.log('click', data.event.offsetX) }
      />

  </div>

}

export default Graphs