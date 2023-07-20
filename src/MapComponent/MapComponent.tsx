/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/default */
import React, { useRef, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
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
import { Circle } from "ol/geom";
import Feature from "ol/Feature";
import { Fill, Stroke, Style } from "ol/style";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";

const styles = {
  mapTextContainer: {
    display: "flex",
    flexDirection: "row",
    margin: "auto",
    paddingLeft: "0px",
    width: "88%",
    fontFamily: "Roboto",
  },
  innerBoxStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto",
    marginTop: "0.8rem",
  },
  box: {
    width: "0.7rem",
    height: "0.6rem",
    border: "1px solid black",
    verticalAlign: "bottom",
  },
  typography: {
    fontSize: "0.8rem",
    padding: "0.1rem",
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

  useEffect(() => {
    if (!map) {
      return;
    }
	
		const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

		map.addLayer(vectorLayer);
		const drawCircle = () => {
			const currentLocation = map.getView().getCenter()/*  proj4("EPSG:4326", "EPSG:3857", [
        position.lon as number,
        position.lat as number,
      ]); */
			
			const circleRadius = 400000;
			if (currentLocation) {
        const circleGeometry = new Circle(currentLocation, circleRadius);
        const circleFeature = new Feature(circleGeometry);

        const circleStyle = new Style({
          stroke: new Stroke({
            color: 'blue',
            width: 2,
          }),
          fill: new Fill({
            color: 'rgba(0, 0, 0, 0.1)',
          }),
        });
        circleFeature.setStyle(circleStyle);
        vectorSource.clear();
        vectorSource.addFeature(circleFeature);
      }
		}
		map.getView().on('change:resolution', drawCircle)

  }, [map]);

  return (
    <MapContext.Provider value={{ map }}>
      <Box ref={mapRef} className="ol-map">
        {children}
        <div id="select"></div>
      </Box>
      <Box sx={styles.mapTextContainer}>
        <Box sx={styles.innerBoxStyle}>
          <Box
            sx={styles.box}
            component="span"
            style={{ background: "rgb(83, 127, 70)", marginLeft: "0.3rem" }}
          ></Box>
          <Typography component="span" sx={styles.typography}>
            Frost heave (kelirikko, GOOD)
          </Typography>
        </Box>
        <Box sx={styles.innerBoxStyle}>
          <Box
            style={{ background: "rgb(139, 172, 82)", marginLeft: "0.3rem" }}
            component="span"
            sx={styles.box}
          ></Box>
          <Typography component="span" sx={styles.typography}>
            Normal summer, mineral soil
          </Typography>
        </Box>
        <Box sx={styles.innerBoxStyle}>
          <Box
            sx={styles.box}
            component="span"
            style={{ background: "rgb(189, 225, 105)", marginLeft: "0.3rem" }}
          ></Box>
          <Typography component="span" sx={styles.typography}>
            Dry summer, mineral soil
          </Typography>
        </Box>
        <Box sx={styles.innerBoxStyle}>
          <Box
            sx={styles.box}
            component="span"
            style={{ background: "rgb(254, 251, 117)", marginLeft: "0.3rem" }}
          ></Box>
          <Typography component="span" sx={styles.typography}>
            Normal summer, peat soil
          </Typography>
        </Box>
        <Box sx={styles.innerBoxStyle}>
          <Box
            sx={styles.box}
            component="span"
            style={{ background: "rgb(242, 162, 92)", marginLeft: "0.3rem" }}
          ></Box>
          <Typography component="span" sx={styles.typography}>
            Dry summer, peat soil
          </Typography>
        </Box>
        <Box sx={styles.innerBoxStyle}>
          <Box
            sx={styles.box}
            component="span"
            style={{ background: "rgb(239, 103, 81)", marginLeft: "0.3rem" }}
          ></Box>
          <Typography component="span" sx={styles.typography}>
            Winter (BAD)
          </Typography>
        </Box>
      </Box>
    </MapContext.Provider>
  );
};

export default MapComponent;
