/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable react/prop-types */
import { useEffect, useContext, useState } from "react";
import { Box } from "@mui/material";
import MapContext from "../MapComponent/MapContext";
import LayerSeclectorComponent from "../LayerSelector/LayerSelector";
import Overlay from "../Overlay/Overlay";
import WMSLayersComponent from "../WMSLayersInput/WMSLayersControl";
import { useAppSelector, useRootDispatch } from "../store/hooks";
import { RootState } from "../store/store";
import { WMSLayers, Map, Smartmet, Parameter } from "../types";
import { mapActions } from "../MapComponent/MapComponentSlice";
import {
  getMarkLineMatch,
  getKeyFromFoundMatch,
  filterLayers,
  getLayers,
} from "../utils/map.util";

const Controls = () => {
  const { baseLayers, map } = useContext(MapContext);
  const [layerForWMS, setLayersForWMS] = useState<WMSLayers[]>([]);
  const [title, setTitle] = useState<string>("Taustakartta");
  const mapState: Map = useAppSelector((state: RootState) => state.mapState);

  const match: Parameter[] = [];
  const {
    soilTemperatureData,
    snowHeightData,
    windGustData,
    soilWetnessData,
    markLine,
    params,
  } = useAppSelector((state: RootState) => state.global);
  const dispatch = useRootDispatch();

  const foundSHeight = getMarkLineMatch(snowHeightData, markLine);
  const foundSWetness = getMarkLineMatch(soilWetnessData, markLine);
  const foundSTemperature = getMarkLineMatch(soilTemperatureData, markLine);
  const foundWGust = getMarkLineMatch(windGustData, markLine);

  if (
    foundSHeight &&
    foundSWetness &&
    foundSTemperature &&
    foundWGust &&
    typeof foundSHeight === "object" &&
    typeof foundSWetness === "object" &&
    typeof foundSTemperature === "object" &&
    typeof foundWGust === "object"
  ) {
    const foundCodeHeight =
      typeof foundSHeight === "object" && getKeyFromFoundMatch(foundSHeight);
    const foundCodeWetness =
      typeof foundSWetness === "object" && getKeyFromFoundMatch(foundSWetness);
    const foundCodeTemperature =
      typeof foundSTemperature === "object" &&
      getKeyFromFoundMatch(foundSTemperature);
    const foundCodeWindGust =
      typeof foundWGust === "object" && getKeyFromFoundMatch(foundWGust);

    const resultSnowHeight =
      foundCodeHeight !== false &&
      foundCodeHeight !== undefined &&
      filterLayers(params.snowHeight, foundCodeHeight);
    const resultSoilWetness =
      foundCodeWetness !== false &&
      foundCodeWetness !== undefined &&
      filterLayers(params.soilWetness, foundCodeWetness);
    const resultSoilTemperature =
      foundCodeTemperature !== false &&
      foundCodeTemperature !== undefined &&
      filterLayers(params.soilTemperature, foundCodeTemperature);
    const resultWindGust =
      foundCodeWindGust !== false &&
      foundCodeWindGust !== undefined &&
      filterLayers(params.windGust, foundCodeWindGust);

    if (resultSnowHeight) {
      if (
        !match.some(
          (item: { code: string }) => item.code === resultSnowHeight.code
        )
      ) {
        match.push(resultSnowHeight);
      }
    }
    if (resultSoilWetness) {
      if (
        !match.some(
          (item: { code: string }) => item.code === resultSoilWetness.code
        )
      ) {
        match.push(resultSoilWetness);
      }
    }
    if (resultSoilTemperature) {
      if (
        !match.some(
          (item: { code: string }) => item.code === resultSoilTemperature.code
        )
      ) {
        match.push(resultSoilTemperature);
      }
    }
    if (resultWindGust) {
      if (
        !match.some(
          (item: { code: string }) => item.code === resultWindGust.code
        )
      ) {
        match.push(resultWindGust);
      }
    }
  }

  const handleBaseLayerChange = (newValue: string) => {
    setTitle(newValue);
    dispatch(mapActions.setBaseLayers(newValue));
  };

  useEffect(() => {
    if (!map || !baseLayers || !mapState.WMSLayerState) return;
    setLayersForWMS(mapState.WMSLayerState);
    const layers = baseLayers.getLayers();
    layers.forEach((layer) => {
      const mapTitle = layer.get("title");
      layer.setVisible(mapTitle === title);
    });
  }, [baseLayers, title, map, mapState.WMSLayerState]);

  window.console.log(match);

  const layers = getLayers(match, mapState.capabilities.Layer);
  window.console.log(layers);
  const newArray = match.map((obj1) => {
    const matchingObj2 = layers.find((obj2) => obj2.Name === obj1.layerName);
  
    return {
      Name: obj1.layerName,
      Title: obj1.layerName,
      // other properties from array1
      show: matchingObj2 ? true : false,
    };
  });
  window.console.log(newArray);
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

        {
          /*match.map(m => m.layerName)
          .filter((l) => l.layerInfo) */
         
          newArray.map((wmsLayer, index) => {
              window.console.log(wmsLayer.show);
              if (!wmsLayer.Name) {
                return <></>;
              }
              return (
                <Box key={wmsLayer.Name}>
                  <WMSLayersComponent
                    name={wmsLayer.Name && wmsLayer.Name}
                    checked={wmsLayer.show}
                    disabled={wmsLayer.show}
                    value={wmsLayer.Name}
                    handleChange={() => {
                      dispatch(mapActions.setWMSLayer(index));
                    }}
                  />
                </Box>
              );
            })
        }
      </Overlay>
    </Box>
  );
};

export default Controls;
