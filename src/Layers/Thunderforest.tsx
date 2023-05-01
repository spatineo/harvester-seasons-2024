import { useEffect, useContext } from "react";
import LayerTile from 'ol/layer/Tile';
import { BaseLayerOptions } from 'ol-layerswitcher';
import { useRootDispatch } from "../store/hooks";
import TileSource from "ol/source/Tile";
import MapContext from "../MapComponent/MapContext";
import {Style, Fill, Circle} from "ol/style";

interface OSMLayerProps {
 source: TileSource
}


const OSMLayer: React.FC<OSMLayerProps> = ({ source }) => {
  const {map} = useContext(MapContext)
  const dispatch = useRootDispatch()
 
  useEffect(() => {
    if (!map) return;
    let cache: any = {};
    function style(select: any){
      return function(f: any) {
        var style = cache[f.get('mag')+'-'+select];
        if (!style) {
          var img = new Circle({
            radius: f.get('mag')*f.get('mag')/2,
            fill: new Fill({
              color: select ? 'rgba(255,0,0,.5)':'rgba(255,128,0,.3)'
            })
          });
          var img2 = new Circle({
            radius: f.get('mag')*f.get('mag')/4,
            fill: new Fill({
              color: select ? 'rgba(255,0,0,.5)':'rgba(255,128,0,.3)'
            })
          });
          style = cache[f.get('mag')+'-'+select] = [
            new Style({ image: img }),
            new Style({ image: img2 })
          ];
        }
        return style;
      }
    };
    
    const osmLayer = new LayerTile({
      background: '#1a2b39',
      title: 'Thunderforest',
      type: 'base',
      source,
      style: style('blue')
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