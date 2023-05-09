/* eslint-disable import/default */
import React, { useEffect } from 'react';
import { Container, Box } from '@mui/material';
import { useRootDispatch } from '../store/hooks';
import HeadingComponent from '../HeadingCompnent/HeadingComponent';
import TraficabilityGraph from '../TrafficanilityGraph/Trafficability';
import GraphView from '../GraphView/GraphView';
import FooterComponent from '../FooterComponent/FooterComponent';
import SwitchComponent from '../SwitchComponent/SwitchComponent';
import * as constants from '../store/constants';
import TimelineSlider from '../TimeLine/TimeLineSlider';
import HarvesterMap from '../HarvesterMapComponent/HarvesterMap';

function MainViewComponent() {
	const dispatch = useRootDispatch();

	useEffect(() => {
		dispatch({ type: constants.TRAFFICABILITY_API });
		dispatch({ type: constants.SOILWETNESS_API });
		dispatch({ type: constants.SOILTEMPERATUE_API });
		dispatch({ type: constants.SNOWHEIGHT_API });
	}, []);

	return (
		<div>
			<Container maxWidth="lg">
				<br />
				<HeadingComponent />
				<br />
				<TraficabilityGraph />
				<SwitchComponent />
				<TimelineSlider />
				<HarvesterMap />
				<Box sx={{ marginTop: '2rem' }}>
					<GraphView />
				</Box>
				<Box sx={{ marginTop: '2rem' }}></Box>
				<br />
				<br />
				<FooterComponent />
			</Container>
		</div>
	);
}
export default MainViewComponent;
