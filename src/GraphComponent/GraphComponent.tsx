import React, { useRef, useEffect } from 'react'
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

interface GrapProps {
 option: {},
 onEvents: {}
}

const GraphComponent: React.FC<GrapProps> = ({ option, onEvents }) => {

  echarts.registerTheme('my_theme', {
    backgroundColor: '#f4cccc'
  });
  return <ReactECharts 
    option={option} 
    onChartReady={() => console.log('chart is ready')} 
    theme="" onEvents={onEvents}
  />;
}

export default GraphComponent