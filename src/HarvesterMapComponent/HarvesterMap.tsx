/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable import/default */
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import MapComponent from "../MapComponent/MapComponent";
import Layers from "../Layers/Layers";
import BaseMap from "../Layers/BaseMap";
import LocationMarkerLayer from "../Layers/LocationMarker";
import WMSLayer from "../Layers/WMSLayer";
import { MapsStateProps, WMSLayers, Map } from "../types";
import TrafficabilityTIFFLayer from "../Layers/TrafficabilityTIFFLayer";
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";
//import WMSCapabilities from "ol/format/WMSCapabilities";
import Controls from "../Layers/Controls";
import "../Map.css";

const HarvesterMap: React.FC = () => {
  const markLine = useAppSelector((state: RootState) => state.global.markLine);
  const mapState: Map = useAppSelector(
    (state: RootState) => state.mapState
  );
  const [stateMap, setStateMap] = useState<MapsStateProps[]>([]);
  const [wmLayer, setWMLayer] = useState<WMSLayers[]>([]);

  useEffect(() => {
    if (!mapState.maps || !mapState.WMSLayerState) return;
    setStateMap(mapState.maps);
    setWMLayer(mapState.WMSLayerState);
  }, [mapState.maps, mapState.WMSLayerState]);

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
                    <BaseMap
                      url={mapArray.url}
                      title={mapArray.title}
                      visible={mapArray.visible}
                      attributions={mapArray.attributions}
                    />
                  </Box>
                );
              })}
            {wmLayer.map((l) => {
              if (!l.layerInfo) {
                return <Box key={l.layerName}></Box>;
              }

              return (
                <Box key={l.layerName}>
                  <WMSLayer
                    strategy={l.WMSTimeStrategy}
                    date={markLine}
                    title={
                      l.layerInfo && l.layerInfo.Title
                        ? l.layerInfo.Title
                        : l.layerName
                    }
                    layerInfo={l.layerInfo}
                    opacity={l.opacity}
                    visible={l.visible}
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
              url="https://copernicus.data.lit.fmi.fi/trafficability/Europe-2023-trfy-r30m.tif"
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
