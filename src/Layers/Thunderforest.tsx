/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable react/prop-types */
import { useEffect, useContext } from 'react';
import LayerTile from 'ol/layer/Tile';
import { BaseLayerOptions } from 'ol-layerswitcher';
import TileSource from 'ol/source/Tile';
import MapContext from '../MapComponent/MapContext';
import { Style, Fill, Circle } from 'ol/style';

interface OSMLayerProps {
	source: TileSource;
}

const OSMLayer: React.FC<OSMLayerProps> = ({ source }) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { map } = useContext(MapContext);

	useEffect(() => {
		if (!map) return;

		const osmLayer = new LayerTile({
			background: '#1a2b39',
			title: 'Thunderforest',
			type: 'base',
			source,
		} as BaseLayerOptions);

		map.addLayer(osmLayer);

		return () => {
			map.removeLayer(osmLayer);
		};
	}, [map]);
	return null;
};

export default OSMLayer;
