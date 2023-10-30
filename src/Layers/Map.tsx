/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/no-named-as-default-member */
import { useEffect, useContext } from 'react';
import MapContext from '../MapComponent/MapContext';
import { BaseLayerOptions } from 'ol-layerswitcher';
//import TileSource from 'ol/source/Tile';
import LayerTile from 'ol/layer/Tile';
import XYZ from "ol/source/XYZ";

interface TileLayerProps {
	url: string;
	title: string;
	visible: boolean;
	attributions: string;
}

// eslint-disable-next-line react/prop-types
const TileLayer: React.FC<TileLayerProps> = ({ url, title, visible, attributions }) => {
  const { map, baseLayers } = useContext(MapContext);

	useEffect(() => {
    if (!map || !baseLayers) return;

		const tileLayer = new LayerTile({
			title,
			type: 'base',
			source: new XYZ({
				url,
				attributions
			}), 
			visible,
			className: 'class',
		} as BaseLayerOptions);
    baseLayers.getLayers().push(tileLayer)

		return () => {
			if (map) {
				map.removeLayer(tileLayer);
			}
		};
	}, [map, title, baseLayers]);
	return null;
};

export default TileLayer;
