import { useEffect, useContext } from "react";
import MapContext from "../MapComponent/MapContext";
import { BaseLayerOptions } from 'ol-layerswitcher';
import TileSource from "ol/source/Tile";
import LayerTile from "ol/layer/Tile";


interface TileLayerProps {
  source: TileSource;
}

const TileLayer: React.FC<TileLayerProps> = ({ source }) => {
  const {map} = useContext(MapContext)
 
  useEffect(() => {
    if (!map) return;
    
    const tileLayer = new LayerTile({
      title: 'TileLayer',
      type: 'base',
      visible: true,
      source,
      className: 'class'
    } as BaseLayerOptions)

    map.addLayer(tileLayer)
    return () => {
      if (map) {
        map.removeLayer(tileLayer);
      }
    };
  }, [map]);
  return null;
};

export default TileLayer;