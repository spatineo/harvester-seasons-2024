/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable react/prop-types */
import { useEffect, useContext, useState } from 'react';

import MapContext from '../MapComponent/MapContext';
import TileLayer from 'ol/layer/Tile';
import WMSCapabilities from 'ol/format/WMSCapabilities';
import { TileWMS } from 'ol/source';
import { useAppSelector } from '../store/hooks';
import { RootState } from '../store/store';
import { current } from '@reduxjs/toolkit';
import { BaseLayerOptions } from 'ol-layerswitcher';

interface WMSLayerProps {
	layerName: string,
	capabilitiesUrl: string,
};

interface DimensionType {
	name: string,
	values: string,
};

interface LayerType {
	Name: string,
	Title: string,
	Dimension: DimensionType[]
};

const WMSLayer: React.FC<WMSLayerProps> = ({layerName, capabilitiesUrl}) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { map } = useContext(MapContext);

	const currentTime = useAppSelector((state: RootState) => state.timeline.value === '' ? null : new Date(state.timeline.value));

	const [ layer, setLayer ] = useState<LayerType>();

	useEffect(() => {
		const parser = new WMSCapabilities();

		fetch(capabilitiesUrl)
  			.then(function (response) {
    			return response.text();
  			})
  			.then(function (text) {
    			const result = parser.read(text);
				const layerInfo = result.Capability.Layer.Layer.find((l : any) => l.Name === layerName)
				console.log('layer', layerInfo);
				setLayer(layerInfo);
			});
	}, [layerName, capabilitiesUrl]);

	useEffect(() => {
		if (!map || !layer) return;

		const availableTimestamps = layer.Dimension.find((d) => d.name === 'time')?.values.split(',').map((timeStr) => new Date(timeStr));

		if (!availableTimestamps || availableTimestamps.length === 0) {
			console.error('no time dimension values for layer!')
			return;
		}

		
		if (currentTime !== null) {
			availableTimestamps.sort((a, b) => (a.getTime() - currentTime.getTime()) - (b.getTime() - currentTime.getTime()));
		} else {
			availableTimestamps.sort((a, b) => a.getTime()- b.getTime() );
		}
		
		const timeStamp = availableTimestamps[availableTimestamps.length-1]
				
		const time = timeStamp.toISOString().replace(/[:-]/g,'').substring(0,15)

		const mapLayer = new TileLayer({
			opacity: .5,
			title: layer.Title,
			source: new TileWMS({
			  url: 'https://desm.harvesterseasons.com/wms',
			  params: {
				'LAYERS': layer.Name,
				'TILED': true,
				'VERSION': '1.3.0',
				'TRANSPARENT': true,
				'time': time,
			  },
			})
		} as BaseLayerOptions);
		map.addLayer(mapLayer);

		return () => {
			map.removeLayer(mapLayer);
		};
	}, [map, layer /*, currentTime*/]);

	return null;
};

export default WMSLayer;
