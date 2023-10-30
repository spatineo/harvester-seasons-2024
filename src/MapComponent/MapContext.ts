// eslint-disable-next-line import/default
import { createContext } from 'react';
import { Map } from 'ol';
import LayerGroup from 'ol/layer/Group'; 

interface MapContextType {
	map: Map | null;
	baseLayers: LayerGroup;
	WMSLayerGroup: LayerGroup;
	locationMarkerLayer: LayerGroup;
}

const MapContext = createContext({} as MapContextType);

export default MapContext;
