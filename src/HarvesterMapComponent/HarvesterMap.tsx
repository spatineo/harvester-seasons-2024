/* eslint-disable import/default */
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import MapComponent from "../MapComponent/MapComponent";
import Layers from "../Layers/Layers";
import Maastokartta from "../Layers/Maastokartta";
import Thunderforest from "../Layers/Thunderforest";
import XYZ from "ol/source/XYZ";
import "../Map.css";
import LocationMarkerLayer from "../Layers/LocationMarker";
import WMSLayer, { WMSLayerTimeStrategy } from "../Layers/WMSLayer";
import TrafficabilityTIFFLayer from "../Layers/TrafficabilityTIFFLayer";
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";
import WMSCapabilities from "ol/format/WMSCapabilities";

const HarvesterMap: React.FC = () => {
  const [harvesterWMSCapabilities, setHarvesterWMSCapabilities] =
    useState<Document | null>(null);
  //const information = useAppSelector((state) => state.language);
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

  const markLine = useAppSelector((state: RootState) => state.global.markLine);
  return (
    <Box>
      <MapComponent>
        <Layers>
          <Maastokartta
            title="Taustakartta"
            source={new XYZ({
              url: "https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/taustakartta/default/WGS84_Pseudo-Mercator/{z}/{y}/{x}.png?api-key=45deef08-fd2f-42ae-9953-5550fff43b17",
              attributions: '<a href="https://www.maanmittauslaitos.fi/karttakuvapalvelu/tekninen-kuvaus-wmts" target="_blank">Maanmittauslaitoksen avoin data</a>',
            })} 
          visible={false}/>
          <Maastokartta
          title="Maastokartta"
            source={new XYZ({
              url: "https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/maastokartta/default/WGS84_Pseudo-Mercator/{z}/{y}/{x}.png?api-key=45deef08-fd2f-42ae-9953-5550fff43b17",
              attributions: '<a href="https://www.maanmittauslaitos.fi/karttakuvapalvelu/tekninen-kuvaus-wmts" target="_blank">Maanmittauslaitoksen avoin data</a>',
            })} 
          visible={false}
          />
          <Thunderforest
          title="Thunderforest"
            source={new XYZ({
              url: "https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png",
              attributions: '<a href="https://www.thunderforest.com/" target="_blank">Thunderforest</a> Data by <a href="https://www.fmi.fi/">Finnish Meteorological Institute</a>',
            })} 
            visible={true}
            />
          <WMSLayer
            layerName="gui:isobands:CERRA_FFG-MS"
            capabilities={harvesterWMSCapabilities}
            strategy={WMSLayerTimeStrategy.LatestBeforeNow}
            opacity={0.5}
            date={markLine}
          />
          <WMSLayer
            layerName="gui:isobands:SWI_SWI2"
            capabilities={harvesterWMSCapabilities}
            strategy={WMSLayerTimeStrategy.LatestBeforeNow}
            opacity={0.5}
            date={markLine}
          />
          <WMSLayer
            layerName="gui:isobands:ERA5L_TSOIL-K"
            capabilities={harvesterWMSCapabilities}
            strategy={WMSLayerTimeStrategy.LatestBeforeNow}
            opacity={0.5}
            date={markLine}
          />
          <WMSLayer
            layerName="harvester:ecsf:HSNOW-M"
            capabilities={harvesterWMSCapabilities}
            strategy={WMSLayerTimeStrategy.LatestBeforeNow}
            opacity={0.5}
            date={markLine}
          />
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
  );
};

//export default HarvesterMap;
const MemoizedHarvesterMap = React.memo(HarvesterMap);
export default MemoizedHarvesterMap;
