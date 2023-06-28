/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable react/prop-types */
import { useEffect, useContext } from 'react';
import MapContext from '../MapComponent/MapContext';
import { BaseLayerOptions } from 'ol-layerswitcher';
import GeoTIFF from 'ol/source/GeoTIFF';
import TileLayer from 'ol/layer/WebGLTile';
import { ExpressionValue } from 'ol/style/expressions';

interface TIFFLayerProps {
	title: string
	url: string
}

const color = {
	// Note! There is one less threshold than colors in palette - the last color in the palette is for all values above last threshold
	thresholds: [0,1,2,3,4,5,6], 
	palette: [
		{r: 0,    g: 0,    b: 0, a: 0},
		{r: 0,    g: .38,  b: 0, a: 1},
		{r: .38,  g: .60,  b: 0, a: 1},
		{r: .627, g: .859, b: 0, a: 1},
		{r: 1.0,  g: .98,  b: 0, a: 1},
		{r: 1.0,  g: .518, b: 0, a: 1},
		{r: 1.0,  g: .149, b: 0, a: 1},
		{r: 0,    g: 0,    b: 0, a: 0},
	]
};

function colorExpression() {
	function process(channel) {
		const c = color.thresholds.reduce((memo, threshold, i) => {
			memo.push([ '<=', ['band', 1], threshold ])
			memo.push(color.palette[i][channel] as number);
			return memo;
		}, ['case'] as [ExpressionValue]);
		c.push(color.palette[color.palette.length-1][channel] as number);
		return c;
	}
	return ['array', process('r'), process('g'), process('b'), process('a') ]
}

const TIFFLayer: React.FC<TIFFLayerProps> = ({ title, url }) => {
	const { map } = useContext(MapContext);

	useEffect(() => {
		if (!map || !url) return;

		const layer = new TileLayer({
			title,
			visible: true,
			opacity: .7,
			className: 'class',
			style:  {
				color: colorExpression(),
				gamma: 1.0,
			},
			source: new GeoTIFF({
				sources: [{ url }],
				normalize: false,
				interpolate: false
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