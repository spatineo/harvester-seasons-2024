import React, { useRef, useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useRootDispatch } from '../store/hooks';
import { setLocation } from './MapComponentSlice';
import MapContext from './MapContext';
import * as ol from "ol"
import { defaults as defaultControls } from "ol/control";
import 'ol/ol.css';

const styles = {
  mapTextContainer: {
    display: 'flex', 
    flexDirection: 'row', 
    margin: '0.6rem 0rem', 
    paddingLeft: '0px',
  },
  innerTextStyle: {
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  box: {
    width: '0.7rem', 
    height: '0.6rem',
    border: '1px solid black', 
    verticalAlign: 'bottom'
  },
  typography: {
    fontSize: '0.87rem',
    padding: '0.1rem'
  }
}

interface MapProps {
  children: React.ReactNode
  resolution: number
  center: [number, number]
  rotation: number
}

const MapComponent: React.FC<MapProps> = ({
  children,
  resolution,
  center,
  rotation
}) => {
 
  const mapRef = useRef();
  const [map, setMap] = useState<any>(null);
  const dispatch = useRootDispatch()
  
  useEffect(() => {
    let options = {
      view: new ol.View({ resolution, center, rotation }),
      layers: [],
      controls: defaultControls(),
      overlays: []
    };
    let mapObject: any = new ol.Map(options);
   
    mapObject.setTarget(mapRef.current);
  
    setMap(mapObject);
    return () => mapObject.setTarget(undefined);
  }, [mapRef]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lon = position.coords.longitude
        const lat = position.coords.latitude
        dispatch(setLocation([lon, lat]))
        },(error) => {
          console.log(error.code, 'error from geolocation', error.message)
        }
      )
    } else {
      console.log("Application cannot access your location");
    }

    if (!map) return;
      map.getView().setCenter(center)
  }, [center])

  return (
    <MapContext.Provider value={{map}}>
      <Box ref={mapRef} className="ol-map">
        {children}
      </Box>
      <Box sx={styles.mapTextContainer}>
        <Box sx={styles.innerTextStyle}>
          <Box sx={styles.box} component="span" style={{ background: 'rgb(83, 127, 70)', marginLeft: '0.3rem' }}></Box>
          <Typography component="span" sx={styles.typography}>Frost heave (kelirikko, GOOD)</Typography>
        </Box>
        <Box sx={styles.innerTextStyle}>
          <Box style={{background: 'rgb(139, 172, 82)', marginLeft: '0.3rem'}}  component="span" sx={styles.box}></Box>
          <Typography component="span" sx={styles.typography}>Normal summer, mineral soil</Typography>
        </Box>
        <Box sx={styles.innerTextStyle}>
          <Box sx={styles.box} component="span" style={{ background: 'rgb(189, 225, 105)', marginLeft: '0.3rem' }}></Box>
          <Typography component="span" sx={styles.typography}>Dry summer, mineral soil</Typography>
        </Box>
        <Box sx={styles.innerTextStyle}>
          <Box sx={styles.box} component="span" style={{ background: 'rgb(254, 251, 117)', marginLeft: '0.3rem' }}></Box>
          <Typography component="span" sx={styles.typography}>Normal summer, peat soil</Typography>
        </Box>
        <Box sx={styles.innerTextStyle}>
          <Box sx={styles.box} component="span" style={{ background: 'rgb(242, 162, 92)', marginLeft: '0.3rem'}}></Box>
          <Typography component="span" sx={styles.typography}>Dry summer, peat soil</Typography>
        </Box>
        <Box sx={styles.innerTextStyle}>
          <Box sx={styles.box} component="span" style={{ background: 'rgb(239, 103, 81)', marginLeft: '0.3rem'}}></Box>
          <Typography component="span" sx={styles.typography}>Winter (BAD)</Typography>
        </Box>
      </Box>
    </MapContext.Provider>
  )
}

export default MapComponent