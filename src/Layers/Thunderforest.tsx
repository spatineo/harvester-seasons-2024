import { useEffect, useContext } from "react";
import LayerTile from 'ol/layer/Tile';
import { BaseLayerOptions } from 'ol-layerswitcher';
import { useRootDispatch } from "../store/hooks";
import TileSource from "ol/source/Tile";
import MapContext from "../MapComponent/MapContext";
import {Style, Fill} from "ol/style";

interface OSMLayerProps {
 source: TileSource
}


const OSMLayer: React.FC<OSMLayerProps> = ({ source }) => {
  const {map} = useContext(MapContext)
  const dispatch = useRootDispatch()
 
  useEffect(() => {
    if (!map) return;
    
    const osmLayer = new LayerTile({
      background: '#1a2b39',
      title: 'Thunderforest',
      type: 'base',
      source,
    } as BaseLayerOptions);

    map.addLayer(osmLayer)
  
    return () => {
      if (map) {
        map.removeLayer(osmLayer);
      }
    };
  }, [map]);
  return null;
};

export default OSMLayer;