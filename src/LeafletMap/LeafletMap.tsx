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

interface MapProps {
  children: React.ReactNode;
}

const LeafletComponent: React.FC<MapProps> = ({ children}) => {
  const leafletRef = useRef();
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    if (!leafletRef.current) {
      return;
    }
    const mapObject: L.Map = L.map(leafletRef.current).setView(
      [66.497, 24.9],
      5
    );

    setMap(mapObject);

    return () => {
      mapObject.remove();
    };
  }, []);

    useEffect(() => {
    if(!map){
      return;
    }

    const baseLayers = {
      "OpenTopoMap": L.tileLayer("https://a.tile.opentopomap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }),
      // Add other base layers if needed
    };
    const overlayLayers = {
      "Temperature": L.marker([61.9241, 25.7482]),
    };
    const layers = L.control
      .layers(baseLayers, overlayLayers, { collapsed: false })
      .addTo(map);
  
    let layer;
    const dataUrl =
      "https://raw.githubusercontent.com/covjson/cookbook/master/examples/coverages/grid.covjson";
    CovJSON.read(dataUrl).then(function (coverage) {
      layer = C.dataLayer(coverage, { parameter: "temperature" })
        .on("afterAdd", function () {
          C.legend(layer).addTo(map);
          map.fitBounds(layer.getBounds());
        })
        .addTo(map);
        layers.addOverlay(layer, "Temperature");
    });

    map.on("click", function (e) {
      new C.DraggableValuePopup({
        layers: [layer],
      })
        .setLatLng(e.latlng)
        .openOn(map);
    });

    return () => {
      if(map){
        map.removeLayer(layer);
      }
    }
  }, [map])
   
  return (
    <LeafletContext.Provider value={{ map }}>
      <Box
        ref={leafletRef}
        style={{ width: "80%", height: "700px", margin: "auto" }}
      >
        {children}
      </Box>
    </LeafletContext.Provider>
  );
};

export default LeafletComponent;
