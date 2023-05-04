import React, { useEffect, useState, FC } from 'react'
import { Box } from '@mui/material'
import GraphComponent from '../GraphComponent/GraphComponent'
import { HarvesterChartProps } from '../types'

const HarvesterSeasons:FC<HarvesterChartProps> = ({
  option,
  handleClick
}) => {
  return (
    <Box>
      {option ? 
      <GraphComponent 
        onEvents={{
        click: handleClick
       }} 
       option={option} 
      /> : <span>No data available</span>
      }
    </Box>
  )
}

export default HarvesterSeasons