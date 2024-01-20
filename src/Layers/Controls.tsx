/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable react/prop-types */
import { useEffect, useContext, useState, Fragment } from "react";
import { Box } from "@mui/material";
import MapContext from "../MapComponent/MapContext";
import LayerSeclectorComponent from "../LayerSelector/LayerSelector";
import Overlay from "../Overlay/Overlay";
import WMSLayersComponent from "../WMSLayersInput/WMSLayersControl";
import { useAppSelector, useRootDispatch } from "../store/hooks";
import { RootState } from "../store/store";
import { WMSLayers, Map, Smartmet } from "../types";
import { mapActions } from "../MapComponent/MapComponentSlice";
import { getMarkLineMatch, getKeyFromFoundMatch } from "../globalSlice";

const Controls = () => {
  const { baseLayers, map } = useContext(MapContext);
  const [layerForWMS, setLayersForWMS] = useState<WMSLayers[]>([]);
  const [title, setTitle] = useState<string>("Taustakartta");
  const mapState: Map = useAppSelector((state: RootState) => state.mapState);
  const { params } = useAppSelector((state: RootState) => state.global);

  const snow = useAppSelector(getMarkLineMatch("snowHeightData"));
  const soil = useAppSelector(getMarkLineMatch("soilTemperatureData"));
  const wetness = useAppSelector(getMarkLineMatch("soilWetnessData"));
  const wind = useAppSelector(getMarkLineMatch("windGustData"));
  const foundKeyForSnow =
    typeof snow === "object" ? getKeyFromFoundMatch(snow) : null;
  const foundKeyForSoil =
    typeof soil === "object" ? getKeyFromFoundMatch(soil) : null;
  const foundKeyForSoilWetness =
    typeof wetness === "object" ? getKeyFromFoundMatch(wetness) : null;
  const foundKeyForWindGust =
    typeof wind === "object" ? getKeyFromFoundMatch(wind) : null;
  const dispatch = useRootDispatch();

  const getOneParamFromEach = [foundKeyForSnow, foundKeyForSoil, foundKeyForSoilWetness, foundKeyForWindGust]  
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

  const addDisableProp = getOneParamFromEach.map(m => {
    if (m !== null) {
      const keys = Object.keys(m);
      const filteredKeys = keys.filter(key => key !== 'utctime');
      return (filteredKeys.length > 0 && m[filteredKeys[0]] !== null) ? {
        ...m,
        disabled: false
      } : {
        ...m,
        disabled: true
      };
    }
  
    return null;
  });
  window.console.log(addDisableProp, 'disabled')

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

        {addDisableProp.length > 0 &&
          addDisableProp.map((wmsLayer, index) => {
            if (!wmsLayer || wmsLayer[0] === null) {
              return <Fragment key={index}></Fragment>;
            }
            const keys = Object.keys(wmsLayer)
            return (
              <Box key={index}>
                <WMSLayersComponent
                  name={keys[1]}
                  checked={mapState.indexNumber === index ? true : false}
                  disabled={wmsLayer.disabled}
                  value={wmsLayer[1] ? wmsLayer[1] : wmsLayer[1]}
                  handleChange={() => {
                    dispatch(mapActions.setIndexNumbers(index));
                    window.console.log(mapState.indexNumber, index);
                  }}
                />
              </Box>
            );
          })}
      </Overlay>
    </Box>
  );
};

export default Controls;
