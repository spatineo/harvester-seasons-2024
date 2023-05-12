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
import { Color } from 'ol/color';
import { RootState } from '../store/store';
import { useAppSelector } from '../store/hooks';
import { MapPosition } from '../MapComponent/MapComponentSlice';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import proj4 from 'proj4';
import { Icon } from 'ol/style';

const style = new Style({
	fill: new Fill({
		color: '#eeeeee',
	}),
});

const iconStyle = new Style({
    image: new Icon({
      anchor: [.5, 1],
      scale: .3,
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      src: 'src/assets/map-pin-icon.svg',
    }),
  });

// eslint-disable-next-line react/prop-types
const LocationMarkerLayer: React.FC = () => {
	const { map } = useContext<any>(MapContext);
    const [ source, setSource] = useState<VectorSource | null>(null);
    const position : MapPosition = useAppSelector((state: RootState) => state.mapState.position);

	useEffect(() => {
		if (!map) return;

        const source = new VectorSource();

		const layer = new VectorLayer({
			title: 'Location marker',
            source,
			style: (feature: any) => iconStyle,
            zIndex: 1000
		} as BaseLayerOptions);

		map.addLayer(layer);
        setSource(source);

		return () => {
			if (map) {
				map.removeLayer(layer);
			}
		};
	}, [map]);

    useEffect(() => {
        if (!source) return;

        source.clear();

        const coords = [position.lon, position.lat];
		const convertedCoords = proj4('EPSG:4326', 'EPSG:3857', coords);

        source.addFeature(new Feature({
            geometry: new Point(convertedCoords)
        }));
    }, [position, source])

	return null;
};

export default LocationMarkerLayer;
