import { useEffect, useContext } from "react";
import { setPosition } from "../MapComponent/MapComponentSlice";
import { useRootDispatch } from "../store/hooks";
import MapContext from "../MapComponent/MapContext";
import TileSource from "ol/source/Tile";
import OLTileLayer from "ol/layer/Tile";
import proj4 from 'proj4'

interface TileLayerProps {
  sources: {
    source: TileSource;
    title: string
    name: string
  }
  zIndex: number;
}

proj4.defs('EPSG:3067', '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs')
proj4.defs('EPSG:4326', '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs')
proj4.defs("EPSG:3857","+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs +type=crs");

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
      const centered = [e.coordinate[0],e.coordinate[1]]
      const reversedCoord = proj4('EPSG:3857', 'EPSG:4326', centered)
      
      dispatch(setPosition({lat: reversedCoord[1], lon: reversedCoord[0]}))
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