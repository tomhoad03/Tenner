import React from 'react'
import { TextField } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'

interface LocationTextFieldProps {
  value: string | null
  onChange: (newText: string) => void
}

const LocationTextField: React.FC<LocationTextFieldProps> = ({ value, onChange }) => {
  return (
    <TextField
      label={'Location'}
      value={value === null ? '' : value}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
      variant="outlined"
      InputProps={{
        startAdornment: <LocationOnIcon />
      }}
      fullWidth
    />
  )
}

export default LocationTextField
