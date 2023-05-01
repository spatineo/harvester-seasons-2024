import React, { useRef, useEffect} from "react"
import * as echarts from "echarts"
import { Box } from "@mui/material"

const TimelineSlider = () => {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log(echarts)
    if(!chartRef) {
      throw Error('Echarts not available')
      }
    const chart = echarts.init(chartRef.current!, undefined, {
      height: '50',
    })

    chart.setOption({
      timeline: {
        type: 'time'
,        data: [
          '2023-04-01',
          '2023-05-01',
          '2023-06-01',
          '2023-07-01',
          '2023-08-01',
          '2023-09-01',
        ],
        label: {
          formatter: function(value: string){
            return echarts.time.format('yyyy-MM-dd', new Date(value).toDateString().substring(3), true, 'UTC');

          }
        },
        formatter: (value: any, index: any) => {
          console.log(value, 'formatter')
        }
      }
    })
    return () => {
      if(chart){
        chart.dispose()
      }
    }
  })
  const option = {
    timeline: {
  
      //loop: false,      
      axisType: 'category',
      show: true,
      autoPlay: false,
      playInterval: 1500,
      data: ['2023', '2024', '2025']         
  },    
  }
  return (
    <div ref={chartRef} >
    </div>
  )
}

export default TimelineSlider