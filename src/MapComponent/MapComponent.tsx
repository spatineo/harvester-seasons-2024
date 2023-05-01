import React, { useRef, useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useRootDispatch, useAppSelector } from '../store/hooks';
import { setPosition } from './MapComponentSlice';
import MapContext from './MapContext';
import * as ol from "ol"
import { defaults as defaultControls} from "ol/control";

import LayerSwitcher from 'ol-layerswitcher';
import proj4 from 'proj4'
import 'ol-ext/dist/ol-ext.css';
import "rc-slider/assets/index.css";


const styles = {
  mapTextContainer: {
    display: 'flex', 
    flexDirection: 'row',
    margin: 'auto',
    paddingLeft: '0px',
    width: '88%',
    fontFamily: 'Roboto',
  },
  innerBoxStyle: {
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'Roboto',
    marginTop: '0.8rem'
  },
  box: {
    width: '0.7rem', 
    height: '0.6rem',
    border: '1px solid black', 
    verticalAlign: 'bottom'
  },
  typography: {
    fontSize: '0.8rem',
    padding: '0.1rem'
  }
}

interface MapProps {
  children: React.ReactNode
  resolution: number
  center: [number, number]
}

proj4.defs('EPSG:3067', '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs')
proj4.defs('EPSG:4326', '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs')
proj4.defs("EPSG:3857","+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs +type=crs");


const MapComponent: React.FC<MapProps> = ({
  children,
  resolution,
  center,
}) => {
 
  const mapRef = useRef();
  const [map, setMap] = useState<any>(null);
  const dispatch = useRootDispatch()
  const mapState = useAppSelector(state => state.mapState)
  
  useEffect(() => {
    
    let options = {
      view: new ol.View({ resolution, center }),
      layers: [],
      controls: defaultControls().extend([new LayerSwitcher()]),
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
       
        dispatch(setPosition({lat, lon}))
        },(error) => {
          console.log(error.code, 'error from geolocation', error.message)
        }
      )
    } else {
      console.log("Application cannot access your location");
    }
  },[])

  useEffect(() => {
    if (!map) return;
  
    const centered = [mapState.position.lon,mapState.position.lat]
    const convertedCoord = proj4('EPSG:4326', 'EPSG:3857', centered)
    map.getView().setCenter(convertedCoord)

  }, [center])

  
  /*
    // Run on the timeline
    var running: any = false; 
    var start = new Date('2015');
    var end = new Date('2016');
    function go(next: any) {
      var date = tline.getDate('start');
      if (running) clearTimeout(running);
      if (!next) {
        // stop
        if (date>start && date<end && running) {
          running = false;
          tline.element.classList.remove('running');
          return;
        }
        if (date > end) {
          date = start;
        }
      }
      if (date > end) {
        tline.element.classList.remove('running');
        return;
      }
      if (date < start) {
        date = start;
      }
      // 1 day
      date = new Date(date.getTime() + 24*60*60*1000);
      tline.setDate(date, { anim:false });
      // next
      tline.element.classList.add('running');
      running = setTimeout(function() { go(true); }, 100);
    }
  }, [map])
 */
  return (
    <MapContext.Provider value={{map}}>
      <Box ref={mapRef} className="ol-map">
        {children}
        <div id="select"></div>
      </Box>
      <Box sx={styles.mapTextContainer}>
        <Box sx={styles.innerBoxStyle}>
          <Box sx={styles.box} component="span" style={{ background: 'rgb(83, 127, 70)', marginLeft: '0.3rem' }}></Box>
          <Typography component="span" sx={styles.typography}>Frost heave (kelirikko, GOOD)</Typography>
        </Box>
        <Box sx={styles.innerBoxStyle}>
          <Box style={{background: 'rgb(139, 172, 82)', marginLeft: '0.3rem'}}  component="span" sx={styles.box}></Box>
          <Typography component="span" sx={styles.typography}>Normal summer, mineral soil</Typography>
        </Box>
        <Box sx={styles.innerBoxStyle}>
          <Box sx={styles.box} component="span" style={{ background: 'rgb(189, 225, 105)', marginLeft: '0.3rem' }}></Box>
          <Typography component="span" sx={styles.typography}>Dry summer, mineral soil</Typography>
        </Box>
        <Box sx={styles.innerBoxStyle}>
          <Box sx={styles.box} component="span" style={{ background: 'rgb(254, 251, 117)', marginLeft: '0.3rem' }}></Box>
          <Typography component="span" sx={styles.typography}>Normal summer, peat soil</Typography>
        </Box>
        <Box sx={styles.innerBoxStyle}>
          <Box sx={styles.box} component="span" style={{ background: 'rgb(242, 162, 92)', marginLeft: '0.3rem'}}></Box>
          <Typography component="span" sx={styles.typography}>Dry summer, peat soil</Typography>
        </Box>
        <Box sx={styles.innerBoxStyle}>
          <Box sx={styles.box} component="span" style={{ background: 'rgb(239, 103, 81)', marginLeft: '0.3rem'}}></Box>
          <Typography component="span" sx={styles.typography}>Winter (BAD)</Typography>
        </Box>
      </Box>
    </MapContext.Provider>
  )
}

export default MapComponent