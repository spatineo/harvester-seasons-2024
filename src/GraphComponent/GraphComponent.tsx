/* eslint-disable import/default */
import React from 'react';
import ReactECharts from 'echarts-for-react';

interface GraphProps {
	onEvents: {};
	option: {};
}

const GraphComponent: React.FC<GraphProps> = ({ onEvents, option }) => {
	return <ReactECharts option={option} theme="" onEvents={onEvents} notMerge={true} />;
};

export default GraphComponent;
