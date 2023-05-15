/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useContext } from 'react';
import { BaseLayerOptions } from 'ol-layerswitcher';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import MapContext from '../MapComponent/MapContext';
import Fill from 'ol/style/Fill';
import Style from 'ol/style/Style';
import { Color } from 'ol/color';
import { Feature } from 'ol';

interface OSMLayerProps {
	source: VectorSource;
}

const style = new Style({
	fill: new Fill({
		color: '#eeeeee',
	}),
});

// eslint-disable-next-line react/prop-types
const Taustakartta: React.FC<OSMLayerProps> = ({ source }) => {
	const { map } = useContext(MapContext);

	useEffect(() => {
		if (!map) return;

		const vectorLayer = new VectorLayer({
			title: 'Taustakartta',
			type: 'base',
			source,
			style: (feature: Feature) => {
				const color: Color = feature.get('COLOR') || '#eeeeee';
				const tmp = style.clone();
				tmp.getFill().setColor(color);
				return tmp;
			},
		} as BaseLayerOptions);

		map.addLayer(vectorLayer);

		return () => {
			map.removeLayer(vectorLayer);
		};
	}, [map]);

	return null;
};

export default Taustakartta;
