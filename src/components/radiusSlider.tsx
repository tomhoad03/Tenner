import React, { useContext } from 'react'
import { Box, Grid, Slider, styled } from '@mui/material'
import MuiInput from '@mui/material/Input'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import LocationContext from '../contexts/locationContext'
import ZoomContext from '../contexts/zoomContext'

const Input = styled(MuiInput)`
  width: 60px;
`

interface RadiusSliderProps {
  onSliderChange: (value: number) => void
}

const RadiusSlider: React.FC<RadiusSliderProps> = ({ onSliderChange }) => {
  const locationContext = useContext(LocationContext)
  const { setR } = locationContext
  const { r: value } = locationContext.location
  const zoomContext = useContext(ZoomContext)
  const { zoomMin, zoomMax, zoomStep } = zoomContext

  const isDisabled = value === null

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setR(zoomMin)
    } else {
      setR(undefined)
    }
  }

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    onSliderChange(newValue as number)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSliderChange(event.target.value === '' ? zoomMin : Number(event.target.value))
  }

  const handleBlur = () => {
    if (!value || value < 0) {
      onSliderChange(0)
    } else if (value > 200) {
      onSliderChange(200)
    }
  }

  return (
    <Box sx={{ marginLeft: '10px' }}>
      <Grid container spacing={3} alignItems="center">
        <FormControlLabel
          label="Radius (km)"
          control={<Checkbox checked={!(value === undefined)} onChange={handleCheckboxChange} color="primary" />}
          labelPlacement="start"
          sx={{ marginTop: '20px' }}
        />
        <Grid item xs>
          <Slider
            value={value || zoomMin}
            onChange={handleSliderChange}
            min={zoomMin}
            max={zoomMax}
            step={zoomStep}
            valueLabelDisplay="auto"
            marks
            aria-labelledby="radius-slider"
            disabled={isDisabled}
          />
        </Grid>
        <Grid item>
          <Input
            value={value || zoomMin}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              min: zoomMin,
              max: zoomMax,
              step: zoomStep,
              type: 'number',
              'aria-labelledby': 'radius-slider'
            }}
            disabled={isDisabled}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default RadiusSlider
