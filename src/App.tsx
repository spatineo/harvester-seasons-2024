import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import MainViewComponent from './MainView/MainViewComponent'
import 'ol/ol.css';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';
import './App.css'

function App() {
  return (
    <div className="App">
      <Box>
        <MainViewComponent />
      </Box>
    </div>
  )
}

export default App
