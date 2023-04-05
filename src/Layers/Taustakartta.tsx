import { useEffect, useContext } from "react";
import LayerTile from 'ol/layer/Tile';
import { BaseLayerOptions } from 'ol-layerswitcher';
import { useRootDispatch } from "../store/hooks";
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import MapContext from "../MapComponent/MapContext";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";

interface OSMLayerProps {
 source: VectorSource
}

const style = new Style({
  fill: new Fill({
    color: '#eeeeee',
  }),
});

const Taustakartta: React.FC<OSMLayerProps> = ({ source }) => {
  const {map} = useContext(MapContext)
  const dispatch = useRootDispatch()
 
  useEffect(() => {
    if (!map) return;
    
    const vectorLayer = new VectorLayer({
      title: 'Taustakartta',
      type: 'base',
      source, 
      style: (feature: any) => {
        const color = feature.get('COLOR') || '#eeeeee';
        style.getFill().setColor(color);
        return style;
      }
    } as BaseLayerOptions);

    map.addLayer(vectorLayer)
  
    return () => {
      if (map) {
        map.removeLayer(vectorLayer);
      }
    };
  }, [map]);
  return null;
};

export default Taustakartta;