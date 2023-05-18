import React, { useContext } from 'react'
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Components } from '../styles'
import ZoomContext from '../contexts/zoomContext'
import LocationContext from '../contexts/locationContext'

interface OpenStreetMapPickerProps {
  onPosChange: (lat: number, lng: number) => void
}

const RADIUS_SCALER = 500
const DEFAULT_CENTER = { lat: 0, lng: 0 }

const OpenStreetMapPicker: React.FC<OpenStreetMapPickerProps> = ({ onPosChange }) => {
  const zoomContext = useContext(ZoomContext)
  const { zoom, setZoom, setZoomMin, setZoomMax, setZoomStep } = zoomContext
  const locationContext = useContext(LocationContext)
  const { setLat, setLng } = locationContext
  const { lat, lng, r } = locationContext.location

  const setZoomMinMaxStep = (newMin: number, newMax: number, newStep: number) => {
    setZoomMin(newMin)
    setZoomMax(newMax)
    setZoomStep(newStep)
  }

  const onZoomChange = (newZoom: number) => {
    setZoom(newZoom)
    if (newZoom >= 14) {
      setZoomMinMaxStep(1, 5, 1)
    } else if (newZoom >= 12) {
      setZoomMinMaxStep(4, 20, 4)
    } else if (newZoom >= 10) {
      setZoomMinMaxStep(10, 50, 10)
    } else if (newZoom >= 8) {
      setZoomMinMaxStep(20, 200, 20)
    } else if (newZoom >= 6) {
      setZoomMinMaxStep(50, 500, 50)
    } else if (newZoom === 5) {
      setZoomMinMaxStep(100, 1000, 100)
    } else if (newZoom >= 3) {
      setZoomMinMaxStep(400, 4000, 400)
    } else if (newZoom >= 1) {
      setZoomMinMaxStep(600, 6000, 600)
    } else {
      setZoomMinMaxStep(800, 8000, 800)
    }
  }

  return (
    <MapContainer center={lat && lng ? { lat, lng } : DEFAULT_CENTER} zoom={zoom} style={Components.mapContainer}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {lat && lng && (
        <>
          <LocationMarker
            lat={lat}
            lng={lng}
            setLat={setLat}
            setLng={setLng}
            onPosChange={onPosChange}
            onZoomChange={onZoomChange}
          />
          <LocationRadius lat={lat} lng={lng} radius={r ?? null} />
        </>
      )}
    </MapContainer>
  )
}

interface LocationMarkerProps {
  lat: number
  lng: number
  setLat: (lat: number) => void
  setLng: (lng: number) => void
  onPosChange: (lat: number, lng: number) => void
  onZoomChange: (zoom: number) => void
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ lat, lng, setLat, setLng, onPosChange, onZoomChange }) => {
  const map = useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom())
    },
    click: (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng
      setLat(lat)
      setLng(lng)
      onPosChange(lat, lng)
    }
  })

  const locationIcon = L.icon(Components.locationIcon)

  return <Marker position={{ lat: lat, lng: lng }} icon={locationIcon}></Marker>
}

interface LocationRadiusProps {
  lat: number
  lng: number
  radius: number | null
}

interface LocationRadiusProps {
  lat: number
  lng: number
  radius: number | null
}

const LocationRadius: React.FC<LocationRadiusProps> = ({ lat, lng, radius }) => {
  return radius !== undefined && radius !== null ? (
    <Circle
      center={{ lat: lat, lng: lng }}
      radius={radius * RADIUS_SCALER}
      pathOptions={Components.locationPickerCircle}
    />
  ) : null
}

export default OpenStreetMapPicker
