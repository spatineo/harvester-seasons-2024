/* eslint-disable import/default */
import React, { useRef, useEffect } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import TimeSlider from 'ol-ext/control/Timeline';
import 'ol/ol.css';
import 'ol-ext/dist/ol-ext.css';

const MapWithTimeSlider = () => {
	const mapRef = useRef(null);

	useEffect(() => {
		if (mapRef.current) {
			const map = new Map({
				target: mapRef.current,
				layers: [
					new TileLayer({
						source: new OSM(),
					}),
				],
				view: new View({
					center: [0, 0],
					zoom: 2,
				}),
			});

			const timeSlider = new TimeSlider();
			map.addControl(timeSlider);
		}
	}, []);

	return <div ref={mapRef} className="map" />;
};

export default MapWithTimeSlider;
