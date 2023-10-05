/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable react/prop-types */
import { useEffect, useContext } from "react";
import LayerTile from "ol/layer/Tile";
import { BaseLayerOptions } from "ol-layerswitcher";
import TileSource from "ol/source/Tile";
import MapContext from "../MapComponent/MapContext";

interface OSMLayerProps {
  source: TileSource;
  title: string;
  visible: boolean;
}

const Thunderforest: React.FC<OSMLayerProps> = ({ source, title,visible }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;

    const thunderForestLayer = new LayerTile({
      title,
      type: "base",
      className: "class",
      visible,
      source,
    } as BaseLayerOptions);
    map.addLayer(thunderForestLayer);

    return () => {
      if (map) {
        map.removeLayer(thunderForestLayer);
      }
    };
  }, [map]);
  return null;
};

export default Thunderforest;
