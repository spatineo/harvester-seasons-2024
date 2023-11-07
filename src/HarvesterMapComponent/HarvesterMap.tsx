/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable import/default */
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import MapComponent from "../MapComponent/MapComponent";
import Layers from "../Layers/Layers";
import Map from "../Layers/Map";
import LocationMarkerLayer from "../Layers/LocationMarker";
import WMSLayer from "../Layers/WMSLayer";
import {
  WMSLayerTimeStrategy,
  MapsStateProps,
  WMSLayers,
} from "../types";
import TrafficabilityTIFFLayer from "../Layers/TrafficabilityTIFFLayer";
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";
//import WMSCapabilities from "ol/format/WMSCapabilities";
import Controls from "../Layers/Controls";
import "../Map.css";

const HarvesterMap: React.FC = () => {
  const markLine = useAppSelector((state: RootState) => state.global.markLine);
  const { maps, WMSLayerState} =
    useAppSelector((state: RootState) => state.mapState);
  const [stateMap, setStateMap] = useState<MapsStateProps[]>([]);
  const [wmLayer, setWMLayer] = useState<WMSLayers[]>([]);
  const strategy =  WMSLayerTimeStrategy.ForceSelectedDate;

  useEffect(() => {
    if (!maps || !WMSLayerState) return;
    setStateMap(maps);
    setWMLayer(WMSLayerState);
  }, [maps, WMSLayerState]);

  return (
    <>
      <Box sx={{ clear: "both" }}>
        <MapComponent>
          <Controls />
          <Layers>
            {stateMap &&
              stateMap.map((mapArray) => {
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
            {wmLayer
              .filter((f) => f.layerInfo)
              .map((l) => {
                return (
                  <Box key={l.layerName}>
                    <WMSLayer
                      strategy={strategy}
                      date={markLine}
                      title={l.layerInfo ? l.layerInfo.Title : l.layerName}
                      layerInfo={l.layerInfo}
                      url={"https://desm.harvesterseasons.com/wms"}
                    />
                    {l.legend.enabled &&
                      l.layerInfo?.Style.map(
                        (
                          legends: {
                            LegendURL: {
                              Format: string;
                              OnlineResource: string;
                              size: Array<number>;
                            };
                          },
                          i
                        ) => {
                          const legendURL = legends.LegendURL;
                          let width = 0;
                          let height = 0;

                          if (Array.isArray(legendURL)) {
                            legendURL.forEach((lg) => {
                              width = lg.size[0];
                              height = lg.size[1];
                            });
                          }
                          return (
                            <Box
                              key={i}
                              sx={{
                                position: "absolute",
                                zIndex: "100",
                                bottom: "-0.6rem",
                                left: "0.4rem",
                                background: "white",
                              }}
                              component="img"
                              src={`https://desm.harvesterseasons.com/wms?REQUEST=GetLegendGraphic&VERSION=1.3.0&LAYER=${l.layerName}&sld_version=1.1.0&style=&FORMAT=image/png&WIDTH=${width}&HEIGHT=${height}`}
                            />
                          );
                        }
                        /* */
                      )}
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
