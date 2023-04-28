import React, { useEffect, useState, FC } from 'react'
import { Box } from '@mui/material'
import GraphComponent from '../GraphComponent/GraphComponent'
import { HarvesterChartProps } from '../types'


const HarvesterSeasons:FC<HarvesterChartProps> = ({
  option
}) => {
  return (
    <Box>
      <GraphComponent onEvents={{}} option={option} />
    </Box>
  )
}

export default HarvesterSeasons