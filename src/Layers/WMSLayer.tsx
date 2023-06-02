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

interface LayerInfo {
	layer: LayerType,
	url: string
}

const WMSLayer: React.FC<WMSLayerProps> = ({layerName, capabilitiesUrl}) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { map } = useContext(MapContext);

	const [ layerInfo, setLayerInfo ] = useState<LayerInfo>();

	useEffect(() => {
		const parser = new WMSCapabilities();

		fetch(capabilitiesUrl)
  			.then(function (response) {
    			return response.text();
  			})
  			.then(function (text) {
    			const result = parser.read(text);

				const layer = result.Capability.Layer.Layer.find((l : any) => l.Name === layerName)
				const url = result.Capability.Request.GetMap.DCPType.find((d : any) => d.HTTP).HTTP.Get.OnlineResource;

				setLayerInfo({ layer, url });
			});
	}, [layerName, capabilitiesUrl]);

	useEffect(() => {
		if (!map || !layerInfo) return;

		const availableTimestamps = layerInfo.layer.Dimension.find((d) => d.name === 'time')?.values.split(',').map((timeStr) => new Date(timeStr));

		if (!availableTimestamps || availableTimestamps.length === 0) {
			console.error('no time dimension values for layer!')
			return;
		}
		
		availableTimestamps.sort((a, b) => a.getTime()- b.getTime() );
		
		
		const timeStamp = availableTimestamps[availableTimestamps.length-1]
				
		//const time = timeStamp.toISOString().replace(/[:-]/g,'').substring(0,15)

		const layer = new TileLayer({
			opacity: .5,
			title: layerInfo.layer.Title,
			source: new TileWMS({
			  url: layerInfo.url,
			  params: {
				'LAYERS': layerInfo.layer.Name,
				'TILED': true,
				'VERSION': '1.3.0',
				'TRANSPARENT': true,
				//'time': time,
			  },
			})
		} as BaseLayerOptions);

		map.addLayer(layer);

		return () => {
			map.removeLayer(layer);
		};
	}, [map, layerInfo /*, currentTime*/]);

	return null;
};

export default WMSLayer;
