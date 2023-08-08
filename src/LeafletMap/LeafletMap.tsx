/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState, useEffect, useRef } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import * as L from "leaflet";
import { Box } from "@mui/material";
import LeafletContext from "./LeafletContext";
import * as CovJSON from "covjson-reader";
import * as C from "leaflet-coverage";
import "leaflet/dist/leaflet.css";

const LeafletComponent: React.FC = () => {
  const leafletRef = useRef();
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    if (!leafletRef.current) {
      return;
    }
    const mapObject: L.Map = L.map(leafletRef.current).setView([64.0, 26.0], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapObject);

    const layers = L.control
      .layers(undefined, undefined, { collapsed: false })
      .addTo(mapObject);

    let layer;
    const dataUrl =
      "https://raw.githubusercontent.com/covjson/cookbook/master/examples/coverages/grid.covjson";
      CovJSON.read(dataUrl).then(function (coverage) {
        layer = C.dataLayer(coverage, {parameter: 'temperature'})
          .on('afterAdd', function () {
            C.legend(layer).addTo(mapObject)
            mapObject.fitBounds(layer.getBounds())
          })
          .addTo(mapObject)
        layers.addOverlay(layer, 'Temperature')
      })
      
      mapObject.on('click', function (e) {
        new C.DraggableValuePopup({
          layers: [layer]
        }).setLatLng(e.latlng).openOn(mapObject)
      })
      
    setMap(mapObject);

    return () => {
      mapObject.remove();
    };
  }, []);

  return (
    <LeafletContext.Provider value={{ map }}>
      <Box
        ref={leafletRef}
        style={{ width: "80%", height: "600px", margin: "auto" }}
      ></Box>
    </LeafletContext.Provider>
  );
};

export default LeafletComponent;
