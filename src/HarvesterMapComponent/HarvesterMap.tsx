/* eslint-disable import/default */
import { Box } from '@mui/material';
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
import '../Map.css';
import LocationMarkerLayer from '../Layers/LocationMarker';
import OSMLayer from '../Layers/OSMLayer';
import React from 'react';
import WMSLayer from '../Layers/WMSLayer';
import STACLayers from '../Layers/STACLayers';

const HarvesterMap: React.FC = () => {
	return (
		<Box>
			<MapComponent>
				<Layer>
					<OSMLayer />
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
					<WMSLayer
						layerName='gui:isobands:SWI_SWI2'
						capabilitiesUrl='https://desm.harvesterseasons.com/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0'
					/>
					<STACLayers searchUrl='https://paituli.csc.fi/geoserver/ogc/stac/search' />
					<LocationMarkerLayer />
				</Layer>
			</MapComponent>
		</Box>
	);
};

export default HarvesterMap;
