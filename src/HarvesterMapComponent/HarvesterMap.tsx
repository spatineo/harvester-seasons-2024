/* eslint-disable import/default */
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import MapComponent from "../MapComponent/MapComponent";
import Layers from "../Layers/Layers";
import Map from "../Layers/Map";
import XYZ from "ol/source/XYZ";
import LocationMarkerLayer from "../Layers/LocationMarker";
import WMSLayer from "../Layers/WMSLayer";
import { WMSLayerTimeStrategy, MapsStateProps } from "../types";
import TrafficabilityTIFFLayer from "../Layers/TrafficabilityTIFFLayer";
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";
import WMSCapabilities from "ol/format/WMSCapabilities";
import Controls from "../Layers/Controls";
import "../Map.css";

const HarvesterMap: React.FC = () => {
  const [harvesterWMSCapabilities, setHarvesterWMSCapabilities] =
    useState<Document | null>(null);
  const markLine = useAppSelector((state: RootState) => state.global.markLine);
  const { WMSLayerState } = useAppSelector(
    (state: RootState) => state.mapState
  );
  const { maps } = useAppSelector((state: RootState) => state.mapState);
  const [stateMap, setStateMap] = useState<MapsStateProps[]>([])

  useEffect(() => {
    const parser = new WMSCapabilities();
    const capabilitiesUrl =
      "https://desm.harvesterseasons.com/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0";

    fetch(capabilitiesUrl)
      .then(function (response) {
        return response.text();
      })
      .then(function (text: string) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const result: Document = parser.read(text);
        setHarvesterWMSCapabilities(result);
      })
      .catch((e) => {
        window.console.error("could not load capabilities", e);
      });
  }, []);

  useEffect(() => {
    if(!maps) return;
    setStateMap(maps)
  }, [maps])

  return (
    <>
      <Box sx={{ clear: "both" }}>
        <MapComponent>
          <Controls />
          <Layers>
            {stateMap && stateMap.map((mapArray) => {
              return (
                <Box key={mapArray.title}>
                  <Map
                    url={mapArray.url}
                    title={mapArray.title}
                    visible={mapArray.visible}
                    attributions={mapArray.attributions}
                  />
                </Box>
              );
            })}
           
            {WMSLayerState.length > 0 &&
              WMSLayerState.map((wms) => {
                return (
                  <Box key={wms.layerName}>
                    <WMSLayer
                      layerName={wms.layerName}
                      capabilities={harvesterWMSCapabilities}
                      strategy={WMSLayerTimeStrategy.ForceSelectedDate}
                      date={markLine}
                      opacity={wms.opacity}
                      visible={wms.visible}
                    />
                  </Box>
                );
              })}
            {/*
					<STACLayers 
						title='Latvuskorkeusmalli'
						searchUrl='https://paituli.csc.fi/geoserver/ogc/stac/search' 
						collection='canopy_height_model_at_fmi'
						band='latvuskorkeusmalli'/>
					*/}
            <TrafficabilityTIFFLayer
              title="Trafficability"
              url="https://pta.data.lit.fmi.fi/geo/harvestability/KKL_SMK_Suomi_2021_06_01-UTM35.tif"
            />
            <LocationMarkerLayer title="Location Marker" />
          </Layers>
        </MapComponent>
      </Box>
    </>
  );
};

//export default HarvesterMap;
const MemoizedHarvesterMap = React.memo(HarvesterMap);
export default MemoizedHarvesterMap;
