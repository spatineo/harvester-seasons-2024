/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import  React, { useRef, useEffect, useState } from 'react'
import *  as echarts from 'echarts'
import { Box } from '@mui/material'
import {  EChartOption } from 'echarts'

interface ChartProps {
  option: EChartOption;
  height: number;
}

const EchartsCompoent: React.FC<ChartProps> = ({ option, height }) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const [chart, setChart] = useState<echarts.ECharts | null>(null)

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
      chart.setOption(option)
    }
  }, [chart, option])

    return (
    <Box ref={chartRef} style={{ width: '100%', height: `${height}px` }}></Box>
  )
}

export default EchartsCompoent