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
	const { map } = useContext<any>(MapContext);

	useEffect(() => {
		if (!map) return;
		const cache: any = {};
		function style(select: any) {
			return function (f: any) {
				// eslint-disable-next-line @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-shadow
				let style = cache[f.get('mag') + '-' + select];
				if (!style) {
					const img = new Circle({
						radius: (f.get('mag') * f.get('mag')) / 2,
						fill: new Fill({
							color: select ? 'rgba(255,0,0,.5)' : 'rgba(255,128,0,.3)',
						}),
					});
					const img2 = new Circle({
						radius: (f.get('mag') * f.get('mag')) / 4,
						fill: new Fill({
							color: select ? 'rgba(255,0,0,.5)' : 'rgba(255,128,0,.3)',
						}),
					});
					style = cache[f.get('mag') + '-' + select] = [
						new Style({ image: img }),
						new Style({ image: img2 }),
					];
				}
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return style;
			};
		}

		const osmLayer = new LayerTile({
			background: '#1a2b39',
			title: 'Thunderforest',
			type: 'base',
			source,
			style: style('blue'),
		} as BaseLayerOptions);

		map.addLayer(osmLayer);

		return () => {
			if (map) {
				map.removeLayer(osmLayer);
			}
		};
	}, [map]);
	return null;
};

export default OSMLayer;
