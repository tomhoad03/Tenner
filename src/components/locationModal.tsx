import React, { useState, useContext } from 'react'
import { Divider, Button, Box } from '@mui/material'
import Slider from './radiusSlider'
import Map from './openStreetMapPicker'
import TextField from './locationTextField'
import SuggestionDropdown from './locationSuggestionDropdown'
import { DEFAULT_LOCATION } from '../contexts/locationContext'
import LocationContext from '../contexts/locationContext'
import LocationProvider from '../providers/locationProvider'
import ZoomProvider from '../providers/zoomProvider'
import ModalHeader from './modalHeader'

interface LocationModalProps {
  onClose: () => void
  onSubmit?: (name: string, lat: number, lng: number, radius: number) => void
}

// TODO - merge with service_listing branch
// TODO - change styling out of base react

const LocationModal: React.FC<LocationModalProps> = ({ onClose, onSubmit }) => {
  const locationContext = useContext(LocationContext)
  const { setName, setLat, setLng, setR, unsetLocation, location } = locationContext
  const [text, setText] = useState<string>(DEFAULT_LOCATION.name ?? '') // Textbox state

  const handleApply = () => {
    if (location.name && location.lat && location.lng && location.r && onSubmit) {
      onSubmit(location.name, location.lat, location.lng, location.r)
      onClose()
    } else {
      throw new Error('Location values must all not be null')
    }
  }

  const handleTextFieldChange = (newText: string) => {
    setName(undefined)
    setText(newText)
  }

  const handleRadiusSliderChange = (newRadius: number) => {
    setR(newRadius)
  }

  const handlePositionChange = (newLat: number, newLong: number) => {
    setLat(newLat)
    setLng(newLong)
    setText(`${newLat}, ${newLong}`)
    setName(undefined)
  }

  const handleLocationSelect = (name: string, lat: number, lng: number) => {
    setText(name)
    setName(name)
    setLat(lat)
    setLng(lng)
  }

  return (
    <>
      <ModalHeader title="Change Location" requestClose={onClose} />
      <Box sx={{ position: 'relative', width: '100%' }}>
        <TextField value={text} onChange={handleTextFieldChange} />
        <Box sx={{ position: 'absolute', width: '100%', zIndex: 2000, boxShadow: 3 }}>
          <SuggestionDropdown searchText={text} onLocationSelect={handleLocationSelect} />
        </Box>
      </Box>
      <br />
      <Slider onSliderChange={handleRadiusSliderChange} />
      <br />
      <div style={{ height: '50vh', minHeight: '400px', width: '100%', marginBottom: '16px' }}>
        <Map onPosChange={handlePositionChange} />
      </div>
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
        <Button
          onClick={handleApply}
          variant="contained"
          color="primary"
          disabled={location.name === null || location.lat === null || location.lng === null}
          sx={{ width: '100%' }}>
          Apply
        </Button>
      </div>
    </>
  )
}

const LocationModalWithContext: React.FC<LocationModalProps> = ({ onClose, onSubmit }) => {
  return (
    <LocationProvider>
      <ZoomProvider>
        <LocationModal onClose={onClose} onSubmit={onSubmit}></LocationModal>
      </ZoomProvider>
    </LocationProvider>
  )
}

export default LocationModalWithContext
