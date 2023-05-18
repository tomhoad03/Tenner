import React, { useState } from 'react'
import { DEFAULT_LOCATION } from '../contexts/locationContext'
import LocationContext from '../contexts/locationContext'
import { LocationData } from '../api/services'

interface LocationProviderProps {
  children: React.ReactNode
}

const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [location, setLocation] = useState<LocationData>(DEFAULT_LOCATION)

  const setName = (name?: string) => {
    setLocation((prevLocation: LocationData) => ({ ...prevLocation, name }))
  }

  const setLat = (lat?: number) => {
    setLocation((prevLocation: LocationData) => ({ ...prevLocation, lat }))
  }

  const setLng = (lng?: number) => {
    setLocation((prevLocation: LocationData) => ({ ...prevLocation, lng }))
  }

  const setR = (r?: number) => {
    setLocation((prevLocation: LocationData) => ({ ...prevLocation, r }))
  }

  const unsetLocation = () => {
    setLocation({ name: undefined, lat: undefined, lng: undefined, r: undefined })
  }

  return (
    <LocationContext.Provider
      value={{
        location: location,
        unsetLocation,
        setName,
        setLat,
        setLng,
        setR
      }}>
      {children}
    </LocationContext.Provider>
  )
}

export default LocationProvider
