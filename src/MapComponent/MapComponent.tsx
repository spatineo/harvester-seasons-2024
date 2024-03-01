/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/default */
import React, { useRef, useEffect, useState } from "react";
import * as ol from "ol";
import LayerGroup from 'ol/layer/Group'; 
import { register } from "ol/proj/proj4";
import proj4 from "proj4";
import { Box } from "@mui/material";
import { useRootDispatch, useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";
import { mapActions } from "./MapComponentSlice";
import MapContext from "./MapContext";
import * as constants from "../store/constants";
import { LanguageOptions } from "../Lang/languageSlice";
import { languages } from "../Lang/languages";

const styles = {
  main: {
    dispplay: "flex",
    flexDirection: "column",
    width: "100%",
    margin: "auto",
    position: "relative",
    top: "0rem"
  },
  container: {
    display: "flex",
    width: "99%",
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: "13.2px",
    gap: "0.4rem",
    paddingTop: "0.5rem",
    margin: "auto",
    position: "relative"
  },
};

interface MapProps {
  children: React.ReactNode;
}

proj4.defs(
  "EPSG:3067",
  "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
);
proj4.defs("EPSG:4326", "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs");
proj4.defs(
  "EPSG:3857",
  "+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs +type=crs"
);
proj4.defs(
  "EPSG:32635",
  "+proj=utm +zone=35 +datum=WGS84 +units=m +no_defs +type=crs"
);
register(proj4);

const MapComponent: React.FC<MapProps> = ({ children }) => {
  const mapRef = useRef();
  const [map, setMap] = useState<ol.Map | null>(null);
  const [baseLayers, setBaseLayers] = useState<any>([]);
  const [WMSLayerGroup, setWMSLayer] = useState([] as any)
  const [locationMarkerLayer, setLocationMarkerLayer] = useState<any>([]);
  const dispatch = useRootDispatch();
  const position = useAppSelector(
    (state: RootState) => state.mapState.position
  );
  const { defaultColorSwitch } = useAppSelector(
    (state: RootState) => state.global
  );
  const information = useAppSelector((state: RootState) => state.language);

  useEffect(() => {
    const options = {
      view: new ol.View({
        resolution: 3550,
        projection: "EPSG:3857",
      }),
      overlays: [],
    };

    const mapObject: ol.Map = new ol.Map(options);
    mapObject.setTarget(mapRef.current);

    mapObject.on("click", (e: ol.MapBrowserEvent<MouseEvent>) => {
      window.console.log(e.coordinate)
      const coord = proj4("EPSG:3857", "EPSG:4326", e.coordinate);
      dispatch(mapActions.setPosition({ lat: coord[1], lon: coord[0] }));
    });

    const actualLayers: LayerGroup[] = [];
    const layerGroups = new LayerGroup({
      layers: actualLayers
    })
    const WMSLayersGroup = new LayerGroup({
      layers: WMSLayerGroup
    })

    const locationMarker = new LayerGroup({
      layers: locationMarkerLayer
    })

    setMap(mapObject);
    setBaseLayers(layerGroups);
    setWMSLayer(WMSLayersGroup);
    setLocationMarkerLayer(locationMarker);
    mapObject.addLayer(layerGroups)
    mapObject.addLayer(WMSLayersGroup)
    mapObject.addLayer(locationMarker)
   
    return () => mapObject.setTarget(undefined);
  }, [mapRef]);

  useEffect(() => {
    if (!map) return;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lon = pos.coords.longitude;
          const lat = pos.coords.latitude;
          dispatch(mapActions.setPosition({ lat, lon }));
        },
        (error) => {
         if(error.code === error.PERMISSION_DENIED || error.code === error.POSITION_UNAVAILABLE){ 
          dispatch(mapActions.setPosition({ lat: 64.00, lon: 25.00 }));
         }
        }
      );
    } else {
      window.console.error("Application cannot access your location");
    }
  }, [map]);

  useEffect(() => {
    if (
      !map ||
      position.lon === undefined ||
      position.lon === null ||
      position.lat === undefined ||
      position.lat === null
    ) {
      return;
    }

    const convertedCoord = proj4("EPSG:4326", "EPSG:3857", [
      position.lon,
      position.lat,
    ]);
    map.getView().setCenter(convertedCoord);
    map.getView().setZoom(12);
    dispatch({ type: constants.POSITION });
  }, [map, position]);

  return (
    <MapContext.Provider value={{ map, baseLayers, WMSLayerGroup, locationMarkerLayer }}>
      <Box ref={mapRef} className="ol-map">
        {children}
        <div id="select"></div>
      </Box>
      <Box sx={styles.main}>
        <Box sx={styles.container}>
          <Box
            sx={{ display: "flex", minWidth: "110px", padding: "0.2rem 0rem" }}
          >
            <Box
              component="span"
              sx={{
                margin: "0.1rem 0.2rem 0rem 0rem",
                backgroundColor: defaultColorSwitch
                  ? "rgba(0, 97, 0, .8)"
                  : "rgb(54, 75, 154) ",
                width: "10px",
                height: "10px",
                border: "1px solid rgba(0, 0, 0, .8)",
              }}
            ></Box>
            <Box component="span">
              {
                languages.frost[
                  information.lang as keyof LanguageOptions
                ] as string
              }
            </Box>
          </Box>
          <Box
            sx={{ display: "flex", minWidth: "110px", padding: "0.2rem 0rem" }}
          >
            <Box
              component="span"
              sx={{
                margin: "0.1rem 0.2rem 0rem 0rem",
                backgroundColor: defaultColorSwitch
                  ? "rgba(97, 153, 0, .8)"
                  : "rgb(74, 123, 183)",
                width: "10px",
                height: "10px",
                border: "1px solid rgba(0, 0, 0, .8)",
              }}
            ></Box>
            <Box>
              {
                languages.normal[
                  information.lang as keyof LanguageOptions
                ] as string
              }
            </Box>
          </Box>
          <Box
            sx={{ display: "flex", minWidth: "110px", padding: "0.2rem 0rem" }}
          >
            <Box
              component="span"
              sx={{
                margin: "0.1rem 0.2rem 0rem 0rem",
                background: defaultColorSwitch
                  ? "rgba(160, 219, 0, .8)"
                  : "rgb(110, 166, 205)",
                width: "10px",
                height: "10px",
                border: "1px solid rgba(0, 0, 0, .8)",
              }}
            ></Box>
            {languages.dry[information.lang as keyof LanguageOptions] as string}
          </Box>
          <Box
            sx={{ display: "flex", minWidth: "110px", padding: "0.2rem 0rem" }}
          >
            <Box
              component="span"
              sx={{
                margin: "0.1rem 0.2rem 0rem 0rem",
                background: defaultColorSwitch
                  ? "rgba(255, 250, 0, .8)"
                  : "rgb(254, 218, 139)",
                width: "10px",
                height: "10px",
                border: "1px solid  rgba(0, 0, 0, .8)",
              }}
            ></Box>
            <Box component="span">
              {" "}
              {
                languages.normalPeat[
                  information.lang as keyof LanguageOptions
                ] as string
              }
            </Box>
          </Box>
          <Box
            sx={{ display: "flex", minWidth: "110px", padding: "0.2rem 0rem" }}
          >
            <Box
              component="span"
              sx={{
                margin: "0.15rem 0.2rem 0rem 0rem",
                background: defaultColorSwitch
                  ? "rgba(255, 132, 0, .8)"
                  : "rgb(246, 126, 75)",
                width: "10px",
                height: "10px",
                border: "1px solid  rgba(0, 0, 0, .8)",
              }}
            ></Box>
            <Box component="span">
              {" "}
              {
                languages.dryPeat[
                  information.lang as keyof LanguageOptions
                ] as string
              }
            </Box>
          </Box>
          <Box
            sx={{ display: "flex", minWidth: "90px", padding: "0.2rem 0rem" }}
          >
            <Box
              component="span"
              sx={{
                margin: "0.1rem 0.2rem 0rem 0rem",
                background: defaultColorSwitch
                  ? "rgba(255, 38, 0, .8)"
                  : " rgb(165, 0, 38)",
                width: "10px",
                height: "10px",
                border: "1px solid  rgba(0, 0, 0, .8)",
              }}
            ></Box>
            <Box component="span">
              {" "}
              {
                languages.winter[
                  information.lang as keyof LanguageOptions
                ] as string
              }
            </Box>
          </Box>
        </Box>
      </Box>
    </MapContext.Provider>
  );
};

export default MapComponent;
