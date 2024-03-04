/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/no-named-as-default-member */
import { useEffect, useContext } from "react";
import MapContext from "../MapComponent/MapContext";
import { BaseLayerOptions } from "ol-layerswitcher";
//import TileSource from 'ol/source/Tile';
import LayerTile from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

interface TileLayerProps {
  url: string;
  visible?: boolean;
  zIndex?: number;
}

const TileLayer: React.FC<TileLayerProps> = ({ url, visible, zIndex }) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    window.console.log("checking for maps");
    if (!map) return;
    const tileLayer = new LayerTile({
      title: "base",
      maxZoom: 16,
      minZoom: 10,
      zIndex,
      source: new XYZ({
        url,
      }),
      visible,
      className: "class",
    } as BaseLayerOptions);
    map.addLayer(tileLayer);

    return () => {
      map.removeLayer(tileLayer);
    };
  }, [map]);
  return null;
};

export default TileLayer;
