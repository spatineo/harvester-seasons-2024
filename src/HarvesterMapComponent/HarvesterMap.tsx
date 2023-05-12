/* eslint-disable import/default */
import React, { FC, useEffect } from 'react';
import { Box } from '@mui/material';
import { useAppSelector, useRootDispatch } from '../store/hooks';
import MapComponent from '../MapComponent/MapComponent';
import Layer from '../Layers/Layers';
import Maastokartta from '../Layers/Maastokartta';
import Thunderforest from '../Layers/Thunderforest';
import Taustakartta from '../Layers/Taustakartta';
import TileLayer from '../Layers/TileLayer';
import XYZ from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import * as olSource from 'ol/source';
import { Map } from '../types';
import * as constants from '../store/constants';
import { RootState } from '../store/store';
import '../Map.css';
import LocationMarkerLayer from '../Layers/LocationMarker';

const HarvesterMap: FC = () => {
	const mapState: Map = useAppSelector((state: RootState) => state.mapState);
	const dispatch = useRootDispatch();

	useEffect(() => {
		dispatch({ type: constants.TRAFFICABILITY_API });
		dispatch({ type: constants.SOILWETNESS_API });
		dispatch({ type: constants.SOILTEMPERATUE_API });
		dispatch({ type: constants.SNOWHEIGHT_API });
	}, []);

	return (
		<Box>
			<MapComponent
				resolution={mapState.position.resolution}
				center={[mapState.position.lon, mapState.position.lat]}
			>
				<Layer>
					<Taustakartta
						source={
							new VectorSource({
								attributions:
									' <a href="https://www.thunderforest.com/">Thunderforest</a> Data by <a href="https://www.fmi.fi/">Finnish Meteorological Institute</a>',
								url: 'https://openlayers.org/data/vector/ecoregions.json',
								format: new GeoJSON(),
							})
						}
					/>
					<Maastokartta
						source={
							new olSource.OSM({
								url: 'https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/maastokartta/default/WGS84_Pseudo-Mercator/{z}/{y}/{x}.png?api-key=45deef08-fd2f-42ae-9953-5550fff43b17',
								attributions:
									'<a href="https://www.thunderforest.com/">Thunderforest</a> Data by <a href="https://www.fmi.fi/">Finnish Meteorological Institute</a>',
							})
						}
					/>
					<TileLayer
						source={
							new olSource.OSM({
								url: 'https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/taustakartta/default/WGS84_Pseudo-Mercator/{z}/{y}/{x}.png?api-key=45deef08-fd2f-42ae-9953-5550fff43b17',
								attributions:
									'<a href="https://www.thunderforest.com/">Thunderforest</a> Data by <a href="https://www.fmi.fi/">Finnish Meteorological Institute</a>',
							})
						}
					/>
					<Thunderforest
						source={
							new XYZ({
								url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
								attributions:
									'<a href="https://www.thunderforest.com/">Thunderforest</a> Data by <a href="https://www.fmi.fi/">Finnish Meteorological Institute</a>',
							})
						}
					/>
					<LocationMarkerLayer />
				</Layer>
			</MapComponent>
		</Box>
	);
};

export default HarvesterMap;
