/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable react/prop-types */
import { useEffect, useContext, useRef, useState } from 'react';
import MapContext from '../MapComponent/MapContext';
import { BaseLayerOptions } from 'ol-layerswitcher';
import { GeoJSONFeature } from 'ol/format/GeoJSON';
import GeoTIFF from 'ol/source/GeoTIFF';
import TileLayer, { SourceType } from 'ol/layer/WebGLTile.js';
import proj4 from 'proj4';


proj4.defs('EPSG:3067', '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
proj4.defs('EPSG:4326', '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs');
proj4.defs(
	'EPSG:3857',
	'+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs +type=crs'
);

interface STACLayersProps {
	searchUrl: string
}

interface AssetObject {
	href: string
	title?: string
	description?: string
	type?: string
	roles?: [string]
}

interface StacItem {
	type: string
	stac_version: string
	stac_extensions?: [string]
	id: string
	geometry: GeoJSONFeature
	bbox: [number]
	properties: Map<string, any>
	links: [LinkObject]
	assets: Map<string, AssetObject>
	collection?: string
}

interface LinkObject {
	rel: string
	href: string
	type?: string
	title?: string
}

interface ItemCollection {
	type: string // "FeatureCollection"
	features: [StacItem]
	links: [LinkObject]
}

const STACLayers: React.FC<STACLayersProps> = ({ searchUrl }) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { map } = useContext(MapContext);

	const [ layer, setLayer ] = useState<TileLayer | undefined>()

	const [ assets, setAssets ] = useState<AssetObject[]>([])

	useEffect(() => {
		if (!searchUrl) return;
		/*
		const params : Record<string, string> = {
			collections: 'sentinel_2_annual_mosaics_at_fmi',
			sortby: '-datetime',
			limit: '1', // TODO: moreee
			//datetime: '2018-02-12T00:00:00Z/2018-03-18T12:31:12Z' // TODO: retrieve from store
		}
		const url = new URL(searchUrl);
		url.search = new URLSearchParams(params).toString();

		fetch(url)
		*/
		const u = 'https://paituli.csc.fi/geoserver/ogc/stac/search?f=json'
		const params = {
			"collection": "sentinel_2_monthly_index_mosaics_at_fmi",
			"time": "2018-02-12T00:00:00Z/2023-03-18T12:31:12Z"
			//collections: ['sentinel_2_annual_mosaics_at_fmi'],
			//sortby: '-datetime',
			//limit: '1', // TODO: moreee
			//datetime: '2018-02-12T00:00:00Z/2018-03-18T12:31:12Z' // TODO: retrieve from store
		}
		
		fetch(u, {
			method: 'POST',
			mode: 'no-cors',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(params)
		})
			.then(function (response) {
				return response.json();
		  	})
		  	.then(function (itemCollection : ItemCollection) {
				//console.log(itemCollection.features.map(f => f.properties.datetime).join('\n'))
				console.log(itemCollection)
				const tmp = itemCollection.features.map((f) : AssetObject => f.assets['b07']);
				setAssets(tmp);

		  	})
			.catch(e => {
				console.error(e);
			});
	}, [searchUrl]);

	useEffect(() => {
		if (!layer) return;

		if (assets.length === 0) {
			if (layer.getSource() != null) {
				console.log('removing current source')
				layer.setSource(null);
			}
			return;
		}

		let source : SourceType | null = layer.getSource();


		source = new GeoTIFF({
			sources: assets.map(a => ({ 'url': a.href })),
			normalize: true,
			sourceOptions: {
				allowFullFile: false
			}
		})

		//layer.setSource(source);

		console.log('foo', assets)
	}, [layer, assets])

	useEffect(() => {
		if (!map) return;

		//const thisSource = new GeoTIFF({ sources: [] })

		const stacLayer = new TileLayer({
			title: 'Stuff',
			//type: 'base',
			visible: true,
			//source: thisSource,
			className: 'class',
			//projection: 'EPSG:3067'
		} as BaseLayerOptions);

		setLayer(stacLayer);

		map.addLayer(stacLayer);
		return () => {
			map.removeLayer(stacLayer);
		};
	}, [map]);

	return null;
};

export default STACLayers;
