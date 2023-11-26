import { Stack } from '@mui/material'
import React, { useState } from 'react'
import LeftPannel from '../components/left-pannel'
import RightPannel from '../components/right-pannel'

const View = () => {
  const [uiJson, setUiJson] = useState(null);
  return (
    <Stack sx={{}} direction={{xs:"column",md:"row"}}>
        <LeftPannel setUiJson={setUiJson}/>
        <RightPannel uiJson={uiJson}/>
    </Stack>
  )
}

export default View