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
import { WMSLayers, Map } from "../types";
import { mapActions } from "../MapComponent/MapComponentSlice";

const Controls = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { baseLayers, map } = useContext(MapContext);
  
  const mapState: Map = useAppSelector(
    (state: RootState) => state.mapState
  );

  const dispatch = useRootDispatch();
  const [layerForWMS, setLayersForWMS] = useState<WMSLayers[]>([])
  const [title, setTitle] = useState<string>("Taustakartta");
  
  const handleBaseLayerChange = (newValue: string) => {
    setTitle(newValue);
    dispatch(mapActions.setBaseLayers(newValue));
  };

  useEffect(() => {
    if (!map || !baseLayers || !mapState.WMSLayerState) return;
    setLayersForWMS(mapState.WMSLayerState)
    const layers = baseLayers.getLayers();
    layers.forEach((layer) => {
      const mapTitle = layer.get("title");
      layer.setVisible(mapTitle === title);
    });

  }, [baseLayers, title, map, mapState.WMSLayerState]);

  return (
    <Box sx={{ position: "relative", top: "-3rem"}}>
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
        <br/>

        {
          layerForWMS.filter(l => l.layerInfo).map((wmsLayer) => {  
            if (!wmsLayer.layerInfo) {
              return <></>;
            }
            return (
              <Box key={wmsLayer.layerName}>
                <WMSLayersComponent
                  name={wmsLayer.layerInfo.Title ? wmsLayer.layerInfo.Title : wmsLayer.layerName}
                  checked={wmsLayer.visible}
                  value={wmsLayer.layerName}
                  handleChange={() => {
                    dispatch(mapActions.setWMSLayer(wmsLayer.id))
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
