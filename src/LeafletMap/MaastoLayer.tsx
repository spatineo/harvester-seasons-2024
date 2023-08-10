/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/no-named-as-default-member */
import React, { useContext, useEffect } from 'react';
import * as L from "leaflet";
import LeafletContext from "./LeafletContext";
import "leaflet/dist/leaflet.css";

interface TileLayerProps {
  source: string;
  attribute: string;
}

export const tileLayer = L.tileLayer(
  "https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/maastokartta/default/WGS84_Pseudo-Mercator/{z}/{y}/{x}.png?api-key=45deef08-fd2f-42ae-9953-5550fff43b17",
  {
    attribution:
      'Tiles by <a href="https://www.maanmittauslaitos.fi/">Maanmittauslaitos</a> Data by <a href="https://www.fmi.fi/">Finnish Meteorological Institute</a>',
    maxZoom: 16,
    minZoom: 3,
  }
)
// eslint-disable-next-line react/prop-types
const MaastoLayer: React.FC = () => {
  const { map } = useContext(LeafletContext);

  useEffect(() => {
    if (!map) return;
    map.addLayer(tileLayer);

    return () => {
      if (map) {
        map.removeLayer(tileLayer);
      }
    };
  }, [map]);
  return null;
};

export default MaastoLayer;
