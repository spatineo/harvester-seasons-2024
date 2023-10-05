/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/no-named-as-default-member */
import { useEffect, useContext } from 'react';
import MapContext from '../MapComponent/MapContext';
import { BaseLayerOptions } from 'ol-layerswitcher';
import TileSource from 'ol/source/Tile';
import LayerTile from 'ol/layer/Tile';

interface TileLayerProps {
	source: TileSource;
	title: string;
	visible: boolean;
}

// eslint-disable-next-line react/prop-types
const TileLayer: React.FC<TileLayerProps> = ({ source, title, visible }) => {
	const { map } = useContext(MapContext);

	useEffect(() => {
		if (!map) return;

		const tileLayer = new LayerTile({
			title,
			type: 'base',
			visible,
			source,
			className: 'class',
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

export default TileLayer;
