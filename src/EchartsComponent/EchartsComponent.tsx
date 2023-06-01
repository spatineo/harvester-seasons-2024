import  React, { useRef, useEffect, useState } from 'react'
import *  as echarts from 'echarts'
import { Box } from '@mui/material'
import {  EChartOption, SeriesOption } from 'echarts'
import { YouTube } from '@mui/icons-material';

type EventParams = {
  componentType: string,
  seriesType: string,
  seriesIndex: number,
  seriesName: string,
  name: string,
  dataIndex: number,
  data: Object,
  dataType: string,
  value: number | Array<any> | any,
  color: string
};

interface ChartProps {
  option: EChartOption;
  setValuesProps: (data: string | null, yValue: (string | number)[]) => void
}

const EchartsCompoent: React.FC<ChartProps> = ({ option, setValuesProps }) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const [chart, setChart] = useState<echarts.ECharts | null>(null)
  const [showLegend, setShowLegend] = useState<boolean>(false);

  useEffect(() => {
    if(chartRef.current) {
      const newChart = echarts.init(chartRef.current)
      setChart(newChart)
    }

    return () => {
      if(chart){
        chart.dispose()
      }
    }
  }, [])

  useEffect(() => {
    if(chart) {
      chart.setOption({
        ...option,
        legend: {
          ...option.legend,
          show: showLegend,
        }
      })
    }
  }, [chart, option, showLegend])

  useEffect(() => {
    if(!chart) {
      return;
    }
    chart.on('mouseover', function(params: EventParams){
      const date: any = params.value[0];
      const yValues: number[] = [];

  // Loop through the series data to collect the y values for the specific date
  option.series?.forEach((series) => {
    if (Array.isArray(series.data)) {
      series.data.forEach((dataItem: any) => {
        if (dataItem[0] === date) {
          yValues.push(dataItem[1]);
        }
      });
    }
  });

  setValuesProps(date, yValues)

    })
  }, [chart])
  
  const handleMouseEnter = () => {
  
    setShowLegend(true);
  };

  const handleMouseLeave = () => {
    setShowLegend(false);
  };

    return (
    <Box ref={chartRef} style={{ width: '100%', height: '300px' }} onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}></Box>
  )
}

export default EchartsCompoent