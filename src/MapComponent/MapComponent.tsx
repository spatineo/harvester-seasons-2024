/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/default */
import React, { useRef, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useRootDispatch, useAppSelector } from "../store/hooks";
import { MapPosition, mapActions } from "./MapComponentSlice";
import MapContext from "./MapContext";
import * as ol from "ol";
import { defaults as defaultControls } from "ol/control";
import * as constants from "../store/constants";
import LayerSwitcher from "ol-layerswitcher";
import proj4 from "proj4";
import { RootState } from "../store/store";
import { register } from "ol/proj/proj4";

const styles = {
  container: {
    marginTop: "0.8rem",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(100px, auto))",
    fontSize: "calc(10px + (18 - 14) * ((100vw - 300px) / (1600 - 300)))",
    fontWeight: "900"
  },
  list: {
    display: "flex",
    marginRight: "0.2rem"
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
  const dispatch = useRootDispatch();
  const position: MapPosition = useAppSelector(
    (state: RootState) => state.mapState.position
  );

  useEffect(() => {
    const options = {
      view: new ol.View({
        resolution: 3550,
        projection: "EPSG:3857",
      }),
      layers: [],
      controls: defaultControls().extend([new LayerSwitcher()]),
      overlays: [],
    };

    const mapObject: ol.Map = new ol.Map(options);
    mapObject.setTarget(mapRef.current);

    mapObject.on("click", (e: ol.MapBrowserEvent<MouseEvent>) => {
      const coord = proj4("EPSG:3857", "EPSG:4326", e.coordinate);
      dispatch(mapActions.setPosition({ lat: coord[1], lon: coord[0] }));
    });

    setMap(mapObject);
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
          window.console.error(
            error.code,
            "error from geolocation",
            error.message
          );
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
    dispatch({ type: constants.POSITION });
  }, [map, position]);

  return (
    <MapContext.Provider value={{ map }}>
      <Box ref={mapRef} className="ol-map">
        {children}
        <div id="select"></div>
      </Box>
      <Box sx={styles.container}>
        <Box sx={styles.list}>
          <Box
            component="span"
            style={{
              margin: '0.1rem 0.2rem 0rem 0rem',
              backgroundColor: "rgba(54, 75, 154)",
              width: "10px",
              height: "10px",
              border: "1px solid  rgba(0, 0, 0)",
            }}
          ></Box>
          Frost heave (kelirikko, GOOD)
        </Box>
        <Box sx={styles.list}>
          <Box
            component="span"
            sx={{
              margin: '0.1rem 0.2rem 0rem 0rem',
              background: "rgba(74, 123, 183)",
              width: "10px",
              height: "10px",
              border: "1px solid  rgba(0, 0, 0)",
            }}
          ></Box>
          Normal summer, mineral soil
        </Box>
        <Box sx={styles.list}>
          <Box
            component="span"
            style={{
              margin: '0.1rem 0.2rem 0rem 0rem',
              background: "rgba(110, 166, 205)",
              width: "10px",
              height: "10px",
              border: "1px solid  rgba(0, 0, 0)",
            }}
          ></Box>
          Dry summer, mineral soil
        </Box>
        <Box sx={styles.list}>
          <Box
            component="span"
            style={{
              margin: '0.1rem 0.2rem 0rem 0rem',
              background: "rgba(254, 218, 139)",
              width: "10px",
              height: "10px",
              border: "1px solid  rgba(0, 0, 0)",
            }}
          ></Box>
          Normal summer, peat soil
        </Box>
        <Box sx={styles.list}>
          <Box
            component="span"
            style={{
              margin: '0.15rem 0.2rem 0rem 0rem',
              background: "rgba(246, 126, 75)",
              width: "10px",
              height: "10px",
              border: "1px solid  rgba(0, 0, 0)",
            }}
          ></Box>
          Dry summer, peat soil
        </Box>
        <Box sx={styles.list}>
          <Box
            component="span"
            style={{
              margin: '0.1rem 0.2rem 0rem 0rem',
              background: "rgba(165, 0, 38)",
              width: "10px",
              height: "10px",
              border: "1px solid  rgba(0, 0, 0)",
            }}
          ></Box>
          Winter (BAD)
        </Box>
      </Box>
    </MapContext.Provider>
  );
};

export default MapComponent;
