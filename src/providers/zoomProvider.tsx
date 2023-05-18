import React, { useState } from 'react'
import ZoomContext, { ZoomState } from '../contexts/zoomContext'

const DEFAULT_ZOOM = { zoom: 7, min: 50, max: 500, step: 50 }

interface ZoomProviderProps {
  children: React.ReactNode
}

const ZoomProvider: React.FC<ZoomProviderProps> = ({ children }) => {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM.zoom)
  const [zoomMin, setZoomMin] = useState(DEFAULT_ZOOM.min)
  const [zoomMax, setZoomMax] = useState(DEFAULT_ZOOM.max)
  const [zoomStep, setZoomStep] = useState(DEFAULT_ZOOM.step)

  const value: ZoomState = {
    zoom,
    zoomMin,
    zoomMax,
    zoomStep,
    setZoom,
    setZoomMin,
    setZoomMax,
    setZoomStep
  }

  return <ZoomContext.Provider value={value}>{children}</ZoomContext.Provider>
}

export default ZoomProvider
