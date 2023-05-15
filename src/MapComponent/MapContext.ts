// eslint-disable-next-line import/default
import React, { createContext } from 'react';
import { Map } from 'ol';

interface MapContextType {
    map: Map | null
}

const MapContext = createContext({} as MapContextType);

export default MapContext;
