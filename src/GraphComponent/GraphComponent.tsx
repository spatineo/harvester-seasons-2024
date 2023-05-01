import React, { useState, useEffect } from 'react'
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

interface GraphProps {
 onEvents: {}
 option: {}
}

const GraphComponent: React.FC<GraphProps> = ({ onEvents, option }) => {

  echarts.registerTheme('my_theme', {
    backgroundColor: '#f4cccc'
  });

  return <ReactECharts
    option={option} 
    theme="" 
    onEvents={onEvents}
  />;
}

export default GraphComponent