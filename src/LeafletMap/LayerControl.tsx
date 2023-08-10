/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/no-named-as-default-member */
import React, { useContext, useEffect } from "react";
import * as L from "leaflet";
import LeafletContext from "./LeafletContext";
import "leaflet/dist/leaflet.css";

interface Layers {
  maasto: L.TileLayer;
  thunder: L.TileLayer;
}
// eslint-disable-next-line react/prop-types
const MaastoLayer: React.FC<Layers> = ({ maasto, thunder }) => {
  const { map } = useContext(LeafletContext);

  useEffect(() => {
    if (!map) return;

    const baseLayers = {
      Maasto: maasto,
      Thunderbase: thunder,
    };
    L.control.layers(baseLayers, undefined).addTo(map);

    return () => {
      if (map) {
        window.console.log("map");
      }
    };
  }, [map]);
  return null;
};

export default MaastoLayer;
