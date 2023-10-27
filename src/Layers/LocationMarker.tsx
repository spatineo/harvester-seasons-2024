/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useContext, useState } from 'react';
import { BaseLayerOptions } from 'ol-layerswitcher';
import VectorLayer from 'ol/layer/Vector';
import MapContext from '../MapComponent/MapContext';
import Fill from 'ol/style/Fill';
import Style from 'ol/style/Style';
import { RootState } from '../store/store';
import { useAppSelector } from '../store/hooks';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import markerIcon from '../assets/map-pin-icon.svg'

import { Icon, Stroke } from 'ol/style';

import * as turf from '@turf/turf';

const CIRCLE_RADIUS_METERS = 2500;

interface MarkerProps {
	title: string
}

const iconStyle = new Style({
	image: new Icon({
		anchor: [0.5, 1],
		scale: 0.3,
		anchorXUnits: 'fraction',
		anchorYUnits: 'fraction',
		src: markerIcon,
	}),
});

const circleStyle = new Style({
	fill: new Fill({
		color: 'rgba(20, 20, 100, .3)',
	}),
	stroke: new Stroke({
		color: 'rgba(20, 20, 100, .9)',
	}),
});

// eslint-disable-next-line react/prop-types
const LocationMarkerLayer: React.FC<MarkerProps> = ({ title }) => {
	const { map, locationMarkerLayer } = useContext(MapContext);
	const [source, setSource] = useState<VectorSource | null>(null);
	const position = useAppSelector((state: RootState) => state.mapState.position);

	useEffect(() => {
		if (!map || !locationMarkerLayer) return;

		const src = new VectorSource();

		const layer = new VectorLayer({
			title,
			source: src,
			style: () => [iconStyle, circleStyle],
			zIndex: 1000,
		} as BaseLayerOptions);

		locationMarkerLayer.getLayers().push(layer)
		setSource(src);

		return () => {
			if (map) {
				map.removeLayer(layer);
			}
		};
	}, [map, title, locationMarkerLayer]);

	useEffect(() => {
		if (!source || !map) return;

		source.clear();

		// No point in adding anything if no position selected yet
		if (
			position.lon === undefined ||
			position.lon === null ||
			position.lat === undefined ||
			position.lat === null
		)
			return;

		const format = new GeoJSON();

		// Add center point
		const center = [position.lon, position.lat];

		const point = format.readFeature(turf.point(center));
		point.getGeometry()?.transform('EPSG:4326', 'EPSG:3857');

		source.addFeature(point);

		// Add a circle around the point
		const circle = format.readFeature(
			turf.circle(center, CIRCLE_RADIUS_METERS, { steps: 24, units: 'meters' })
		);
		circle.getGeometry()?.transform('EPSG:4326', 'EPSG:3857');

		source.addFeature(circle);
	}, [position, source]);

	return null;
};

export default LocationMarkerLayer;
