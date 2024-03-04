/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable import/default */
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import MapComponent from "../MapComponent/MapComponent";
import { getMarkLineMatch } from "../utils/map.util";
import Layers from "../Layers/Layers";
import BaseMap from "../Layers/BaseMap";
import MapLayers from "../Layers/MapLayers";
import LocationMarkerLayer from "../Layers/LocationMarker";
import WMSLayer from "../Layers/WMSLayer";
import { MapsStateProps, Map, Parameter, LayersWithLayerInfo } from "../types";
import TrafficabilityTIFFLayer from "../Layers/TrafficabilityTIFFLayer";
import { useAppSelector } from "../store/hooks";
import {
  getLayersWithLayerInfo,
  getOneParamFromData,
  checkForDataStringOrObject,
  findMatchingLayers,
} from "../utils/map.util";
import { RootState } from "../store/store";
//import WMSCapabilities from "ol/format/WMSCapabilities";
import Controls from "../Layers/Controls";
import "../Map.css";

const HarvesterMap: React.FC = () => {
  const markLine = useAppSelector((state: RootState) => state.global.markLine);
  const mapState: Map = useAppSelector((state: RootState) => state.mapState);
  const { params } = useAppSelector((state: RootState) => state.global);
  const [stateMap, setStateMap] = useState<MapsStateProps[]>([]);
  const [controlLayers, setControlLayers] = useState<
    (LayersWithLayerInfo | undefined)[]
  >([]);
  const snow = useAppSelector(getMarkLineMatch("snowHeightData"));
  const soil = useAppSelector(getMarkLineMatch("soilTemperatureData"));
  const wetness = useAppSelector(getMarkLineMatch("soilWetnessData"));
  const wind = useAppSelector(getMarkLineMatch("windGustData"));
  useEffect(() => {
    if (!mapState.maps) return;
    setStateMap(mapState.maps);
  }, [mapState.maps]);

  useEffect(() => {
    const foundKeyForSnow = snow && checkForDataStringOrObject(snow);
    const foundKeyForSoil = soil && checkForDataStringOrObject(soil);
    const foundKeyForSoilWetness =
      wetness && checkForDataStringOrObject(wetness);
    const foundKeyForWindGust = wind && checkForDataStringOrObject(wind);

    const getOneParamFromEach = [
      foundKeyForSnow,
      foundKeyForSoil,
      foundKeyForSoilWetness,
      foundKeyForWindGust,
    ];
    const getOneParamFromDataParams = getOneParamFromData(getOneParamFromEach);
    const allLayers: Parameter[] = [
      ...params.snowHeight.map((layer) => layer),
      ...params.soilWetness.map((layer) => layer),
      ...params.soilTemperature.map((layer) => layer),
      ...params.windGust.map((layer) => layer),
    ];
    const result = findMatchingLayers(getOneParamFromDataParams, allLayers);
    const layersWithInfo = getLayersWithLayerInfo(result, mapState.layerState);

    setControlLayers(layersWithInfo);
  }, [snow, soil, wetness, wind]);

  return (
    <Box sx={{ clear: "both" }}>
      <MapComponent>
        <Controls />
        <Layers>
          <BaseMap url="https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/kiinteistojaotus/default/WGS84_Pseudo-Mercator/{z}/{y}/{x}.png?api-key=45deef08-fd2f-42ae-9953-5550fff43b17" 
            visible={true}
            zIndex={20}/>
            {stateMap &&
            stateMap.map((mapArray, index) => {
              return (
                <Box key={index}>
                  <MapLayers
                    url={mapArray.url}
                    title={mapArray.title}
                    visible={mapArray.visible}
                    attributions={mapArray.attributions}
                  />
                </Box>
              );
            })}
          {controlLayers &&
            controlLayers.map((l, index) => {
              if (l === undefined || !l.layerInfo) {
                return <Box key={`undefined_${index}`}></Box>;
              }
              return (
                <Box key={l.id}>
                  {l.id === mapState.indexNumber && (
                    <WMSLayer
                      layerInfo={l.layerInfo}
                      strategy={l.WMSTimeStrategy}
                      date={markLine}
                      opacity={0.5}
                      visible={true}
                      title={
                        l.layerInfo.Title
                          ? l.layerInfo.Title
                          : (l.layerName as string)
                      }
                      url={"https://desm.harvesterseasons.com/wms"}
                    />
                  )}
                  {l.id === mapState.indexNumber &&
                    l.layerInfo !== null &&
                    l.layerInfo.Style !== undefined &&
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
                              maxWidth: "100px",
                              background: "transparent",
                              zIndex: "100",
                              position: "absolute",
                              bottom: "4rem",
                              right: "0.6rem",
                              overflowY: "hidden",
                              overflowX: "hidden",
                            }}
                          >
                            <Box
                              sx={{
                                position: "relative",
                                left: "0rem",
                                height: "100%",
                                top: "0rem",
                                zIndex: "100",
                                margin: "auto",
                                background: "rgba(255, 255, 255, 0.5)",
                              }}
                              component="img"
                              src={`https://desm.harvesterseasons.com/wms?REQUEST=GetLegendGraphic&VERSION=1.3.0&LAYER=${
                                l.layerInfo?.Name as string
                              }&sld_version=1.1.0&style=&FORMAT=image/png&WIDTH=${width}&HEIGHT=${height}`}
                            />
                          </Box>
                        );
                      }
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
            title="Trafficability Finland"
            finlandUrl="https://pta.data.lit.fmi.fi/geo/harvestability/KKL_SMK_Suomi_2021_06_01-UTM35.tif"
            europeUrl="https://copernicus.data.lit.fmi.fi/trafficability/Europe-2023-trfy-r30m.tif"
            zIndex={1}
            visible={mapState.showTrafficabilityLayer}
          />
          <LocationMarkerLayer title="Location Marker" />
        </Layers>
      </MapComponent>
    </Box>
  );
};

//export default HarvesterMap;
const MemoizedHarvesterMap = React.memo(HarvesterMap);
export default MemoizedHarvesterMap;
