/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable react/prop-types */
import { useEffect, useContext, useState } from 'react';
import MapContext from '../MapComponent/MapContext';
import { BaseLayerOptions } from 'ol-layerswitcher';
import { GeoJSONFeature } from 'ol/format/GeoJSON';
import GeoTIFF from 'ol/source/GeoTIFF';
import TileLayer, { SourceType } from 'ol/layer/WebGLTile';
import { EnqueueSnackbar } from '../store/hooks';

interface STACLayersProps {
	title: string
	searchUrl: string
	collection: string
	band: string
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
	properties: Map<string, string>
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

const STACLayers: React.FC<STACLayersProps> = ({ title, searchUrl, collection, band }) => {
	const { map } = useContext(MapContext);

	const [ layer, setLayer ] = useState<TileLayer | undefined>()

	const [ assets, setAssets ] = useState<AssetObject[]>([])

	useEffect(() => {
		if (!searchUrl) return;

		const params : Record<string, string> = {
			collections: collection,
			sortby: '-datetime',
			limit: '1', // TODO: i just can't get enough
			//datetime: '2018-02-12T00:00:00Z/2018-03-18T12:31:12Z' // TODO: retrieve from store
		}
		const url = new URL(searchUrl);
		url.search = new URLSearchParams(params).toString();

		fetch(url)
			.then(function (response) {
				return response.json();
		  	})
		  	.then(function (itemCollection : ItemCollection) {
				if (itemCollection.features.find(f => f.assets[band] === undefined)) {
					EnqueueSnackbar(`band ${band} not found in collection ${collection} from STAC ${searchUrl}`, 'error');	
					setAssets([]);
					return;
				}
				const tmp = itemCollection.features.map((f) => f.assets[band] as AssetObject);
				
				setAssets(tmp);
		  	})
			.catch(e => {
				EnqueueSnackbar(`failed to load collection ${collection} from STAC ${searchUrl}`, 'error');
				console.error(e);
			});
	}, [searchUrl]);

	useEffect(() => {
		if (!layer) return;

		if (assets.length === 0) {
			if (layer.getSource() != null) {
				layer.setSource(null);
			}
			return;
		}

		let source : SourceType | null = layer.getSource();

		source = new GeoTIFF({
			sources: assets.map(a => ({ 'url': a.href })),
			normalize: true,
		})

		layer.setSource(source);
	}, [layer, assets])

	useEffect(() => {
		if (!map) return;

		const stacLayer = new TileLayer({
			title,
			visible: true,
			className: 'class',
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
