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
import WMSLayersComponent from "../WMSLayersInput/WMSLayersComponent";
import { useAppSelector, useRootDispatch } from "../store/hooks";
import { RootState } from "../store/store";
import { WMSLayers } from "../types";
import { mapActions } from "../MapComponent/MapComponentSlice";

const Controls = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { baseLayers, map } = useContext(MapContext);
  
  const { WMSLayerState, maps } = useAppSelector(
    (state: RootState) => state.mapState
  );
  const dispatch = useRootDispatch();
  const [layerForWMS, setLayersForWMS] = useState<WMSLayers[]>([])
  const [title, setTitle] = useState<string>("Taustakartta");
  const [wmsLayerName, setWmsLayerName] = useState("gui:isobands:CERRA_FFG-MS");
  

  const handleBaseLayerChange = (newValue: string) => {
    setTitle(newValue);
    dispatch(mapActions.setBaseLayers(newValue));
  };

  const handleLayers = (newValue: string, index: number) => {
    setWmsLayerName(newValue);
    dispatch(
      mapActions.setWMSLayer({
        layerName: newValue,
        index,
      })
    );
  };

  useEffect(() => {
    if (!map || !baseLayers || !WMSLayerState) return;
    setLayersForWMS(WMSLayerState)
    const layers = baseLayers.getLayers();
    layers.forEach((layer) => {
      const mapTitle = layer.get("title");
      layer.setVisible(mapTitle === title);
    });

  }, [baseLayers, title, map, wmsLayerName]);

  return (
    <Box>
      <Overlay>
        <Box>
          {maps.map((m) => {
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

        {layerForWMS.length > 0 &&
          layerForWMS.map((wmsLayer, index) => {
            return (
              <Box key={wmsLayer.layerName}>
                <WMSLayersComponent
                  name={wmsLayer.layerName}
                  checked={wmsLayer.visible}
                  value={wmsLayer.layerName}
                  handleChange={handleLayers}
                  index={index}
                />
              </Box>
            );
          })}
      </Overlay>
    </Box>
  );
};

export default Controls;
