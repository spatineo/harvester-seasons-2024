// eslint-disable-next-line import/default
import { createContext } from 'react';
import * as L from 'leaflet';

interface MapContextType {
  map: L.Map | null;
}

const LeafletContext = createContext<MapContextType>({ map: null });

export default LeafletContext;