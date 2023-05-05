// eslint-disable-next-line @typescript-eslint/no-unused-vars, import/default
import React from 'react';
import { Box } from '@mui/material';
import MainViewComponent from './MainView/MainViewComponent';
import 'ol/ol.css';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';
import './App.css';

function App() {
	return (
		<div className="App">
			<Box>
				<MainViewComponent />
			</Box>
		</div>
	);
}

export default App;
