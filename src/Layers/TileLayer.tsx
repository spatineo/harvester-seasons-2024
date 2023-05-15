/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable react/prop-types */
import { useEffect, useContext } from 'react';
import MapContext from '../MapComponent/MapContext';
import { BaseLayerOptions } from 'ol-layerswitcher';
import TileSource from 'ol/source/Tile';
import LayerTile from 'ol/layer/Tile';

interface TileLayerProps {
	source: TileSource;
}

const TileLayer: React.FC<TileLayerProps> = ({ source }) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { map } = useContext(MapContext);

	useEffect(() => {
		if (!map) return;

		const tileLayer = new LayerTile({
			title: 'TileLayer',
			type: 'base',
			visible: true,
			source,
			className: 'class',
		} as BaseLayerOptions);

		map.addLayer(tileLayer);
		return () => {
			map.removeLayer(tileLayer);
		};
	}, [map]);
	return null;
};

export default TileLayer;
