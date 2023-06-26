/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable react/prop-types */
import { useEffect, useContext } from 'react';
import MapContext from '../MapComponent/MapContext';
import { BaseLayerOptions } from 'ol-layerswitcher';
import GeoTIFF from 'ol/source/GeoTIFF';
import TileLayer from 'ol/layer/WebGLTile';

interface TIFFLayerProps {
	title: string
	url: string
}

const TIFFLayer: React.FC<TIFFLayerProps> = ({ title, url }) => {
	const { map } = useContext(MapContext);

	useEffect(() => {
		if (!map || !url) return;

		const layer = new TileLayer({
			title,
			visible: true,
			className: 'class',
			source: new GeoTIFF({
				sources: [{ url }],
				normalize: true,
			})
		} as BaseLayerOptions);

		map.addLayer(layer);

		return () => {
			map.removeLayer(layer);
		};
	}, [map, url, title]);

	return null;
};

export default TIFFLayer;
