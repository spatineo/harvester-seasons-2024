/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/no-named-as-default-member */
import { useEffect, useContext } from 'react';
import MapContext from '../MapComponent/MapContext';
import { BaseLayerOptions } from 'ol-layerswitcher';
import LayerTile from 'ol/layer/Tile';
import { OSM } from 'ol/source';


// eslint-disable-next-line react/prop-types
const OSMLayer: React.FC = () => {
	const { map } = useContext(MapContext);

	useEffect(() => {
		if (!map) return;

		const tileLayer = new LayerTile({
			title: 'OSM',
			type: 'base',
			source: new OSM(),
		} as BaseLayerOptions);

		map.addLayer(tileLayer);

		return () => {
			if (map) {
				map.removeLayer(tileLayer);
			}
		};
	}, [map]);
	return null;
};

export default OSMLayer;
