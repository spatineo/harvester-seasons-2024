import React from 'react';
import { Box, TextField } from '@mui/material'

const BaseControl = () => {
  return(
    <Box className="base-control">
      <TextField type="radio" value="base"/>
    </Box>
  )
}

export default BaseControl