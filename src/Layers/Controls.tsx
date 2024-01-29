/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable react/prop-types */
import { useEffect, useContext, useState, Fragment } from "react";
import { Box } from "@mui/material";
import MapContext from "../MapComponent/MapContext";
import LayerSeclectorComponent from "../LayerSelector/LayerSelector";
import ShowTrafficabilityComponent from "../ShowTrafficabilityComponent/ShowTrafficabilityComponent";
import Overlay from "../Overlay/Overlay";
import WMSLayersComponent from "../WMSLayersInput/WMSLayersControl";
import { useAppSelector, useRootDispatch } from "../store/hooks";
import { RootState } from "../store/store";
import { Map, Parameter } from "../types";
import { mapActions } from "../MapComponent/MapComponentSlice";
import {
  getLayersWithLayerInfo,
  getOneParamFromData,
  checkForDataStringOrObject,
  findMatchingLayers,
  getMarkLineMatch,
} from "../utils/map.util";

const Controls = () => {
  const { baseLayers, map } = useContext(MapContext);
  const [title, setTitle] = useState<string>("Taustakartta");
  const mapState: Map = useAppSelector((state: RootState) => state.mapState);
  const { params } = useAppSelector((state: RootState) => state.global);

  const snow = useAppSelector(getMarkLineMatch("snowHeightData"));
  const soil = useAppSelector(getMarkLineMatch("soilTemperatureData"));
  const wetness = useAppSelector(getMarkLineMatch("soilWetnessData"));
  const wind = useAppSelector(getMarkLineMatch("windGustData"));

  const foundKeyForSnow = snow && checkForDataStringOrObject(snow);
  const foundKeyForSoil = soil && checkForDataStringOrObject(soil);
  const foundKeyForSoilWetness = wetness && checkForDataStringOrObject(wetness);
  const foundKeyForWindGust = wind && checkForDataStringOrObject(wind);
  const dispatch = useRootDispatch();

  const getOneParamFromEach = [
    foundKeyForSnow,
    foundKeyForSoil,
    foundKeyForSoilWetness,
    foundKeyForWindGust,
  ];
  const handleBaseLayerChange = (newValue: string) => {
    setTitle(newValue);
    dispatch(mapActions.setBaseLayers(newValue));
  };

  useEffect(() => {
    if (!map || !baseLayers) return;
    const layers = baseLayers.getLayers();
    layers.forEach((layer) => {
      const mapTitle = layer.get("title");
      layer.setVisible(mapTitle === title);
    });
  }, [baseLayers, title, map]);

  const getOneParamFromDataParams = getOneParamFromData(getOneParamFromEach);
  const allLayers: Parameter[] = [
    ...params.snowHeight.map((layer) => layer),
    ...params.soilWetness.map((layer) => layer),
    ...params.soilTemperature.map((layer) => layer),
    ...params.windGust.map((layer) => layer),
  ];
  const result = findMatchingLayers(getOneParamFromDataParams, allLayers);
  const layersWithInfo = getLayersWithLayerInfo(result, mapState.layerState);


  return (
    <Box sx={{ position: "relative", top: "-3rem" }}>
      <Overlay>
        <Box>
          {mapState.maps.map((m) => {
            return (
              <Box key={m.title}>
                <LayerSeclectorComponent
                  value={m.title}
                  handleChange={handleBaseLayerChange}
                  checked={m.visible}
                />
              </Box>
            );
          })}
        </Box>
        <br />

        {layersWithInfo.length > 0 &&
          layersWithInfo.map((wmsLayer, index) => {
            if (!wmsLayer || wmsLayer[0] === null) {
              return <Fragment key={index}></Fragment>;
            }
            const keys = Object.values(wmsLayer);
            return (
              <Box key={index}>
                <WMSLayersComponent
                  name={
                    wmsLayer.dataFound === null
                    ? "No data to display"
                    : wmsLayer.layerInfo?.Title
                      ? wmsLayer.layerInfo.Title
                      : `Layer missing ${wmsLayer.layerName as string}`
                  }
                  checked={
                    wmsLayer.disabled === true
                      ? false
                      : wmsLayer.id === mapState.indexNumber
                  }
                  disabled={keys[2] as boolean}
                  value={wmsLayer[1] ? wmsLayer[1] : wmsLayer[1]}
                  handleChange={() => {
                    dispatch(mapActions.setIndexNumbers(wmsLayer.id));
                  }}
                />
              </Box>
            );
          })}
        <Box>
          <ShowTrafficabilityComponent
            text={"Trafficability"}
            show={mapState.showTrafficabilityLayer}
            handleChange={() => dispatch(mapActions.setShowTrafficabilityLayer(!mapState.showTrafficabilityLayer))}
          />
        </Box>
      </Overlay>
    </Box>
  );
};

export default Controls;
