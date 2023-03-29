import { useEffect, useContext } from "react";
import { setLocation } from "../MapComponent/MapComponentSlice";
import { useRootDispatch } from "../store/hooks";
import MapContext from "../MapComponent/MapContext";
import TileSource from "ol/source/Tile";
import OLTileLayer from "ol/layer/Tile";

interface TileLayerProps {
  sources: {
    source: TileSource;
    title: string
    name: string
  }
  zIndex: number;
}

const TileLayer: React.FC<TileLayerProps> = ({ sources, zIndex = 0}) => {
  const {map} = useContext(MapContext)
  const dispatch = useRootDispatch()
 
  useEffect(() => {
    if (!map) return;
    
    let tileLayer = new OLTileLayer({
      source: sources.source,
      zIndex,
    },);

    map.addLayer(tileLayer)
    tileLayer.setZIndex(zIndex);
   
    map.on('click', (e: any) => {
      dispatch(setLocation(e.coordinate))
    });;
    return () => {
      if (map) {
        map.removeLayer(tileLayer);
      }
    };
  }, [map]);
  return null;
};

export default TileLayer;