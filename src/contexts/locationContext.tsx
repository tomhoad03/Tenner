import React from 'react'
import { LocationData } from '../api/services'

export const DEFAULT_LOCATION: LocationData = { name: 'Southampton', lat: 51, lng: -1.4, r: 50 }

interface LocationContextType {
  location: LocationData
  setName: (name?: string) => void
  setLat: (lat?: number) => void
  setLng: (lng?: number) => void
  setR: (r?: number) => void
  unsetLocation: () => void
}

const LocationContext = React.createContext<LocationContextType>({
  location: DEFAULT_LOCATION,
  unsetLocation: () => {
    throw new Error('unsetLocation() not implemented')
  },
  setName: () => {
    throw new Error('setName() not implemented')
  },
  setLat: () => {
    throw new Error('setLat() not implemented')
  },
  setLng: () => {
    throw new Error('setLng() not implemented')
  },
  setR: () => {
    throw new Error('setR() not implemented')
  }
})

export default LocationContext
