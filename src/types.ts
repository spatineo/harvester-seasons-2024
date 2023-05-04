export interface HarvesterChartProps  {
  option: {}
  handleClick: (data: {value: []}) => void
}

export interface Parameter {
  code: string
  title?: string
}

export interface GlobalStateProps {
   startEndTimeSpan: {
    start_time: string
    end_time: string
    time_step: number
  }
   trafficabilityData: []
   soilWetnessData: [] 
   soilTemperatureData: []
   snowHeight: []
   checked: boolean,
   parameters: {
    trafficability: Parameter[]
    snowHeight: Parameter[]
    soilTemperature: Parameter[]
    soilWetness: Parameter[]
   }
 }