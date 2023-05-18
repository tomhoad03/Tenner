import { createContext } from 'react'

export interface ZoomState {
  zoom: number
  zoomMin: number
  zoomMax: number
  zoomStep: number
  setZoom: (zoom: number) => void
  setZoomMin: (zoomMin: number) => void
  setZoomMax: (zoomMax: number) => void
  setZoomStep: (zoomStep: number) => void
}

const DEFAULT_ZOOM = { zoom: 7, min: 50, max: 500, step: 50 }

const ZoomContext = createContext<ZoomState>({
  zoom: DEFAULT_ZOOM.zoom,
  zoomMin: DEFAULT_ZOOM.min,
  zoomMax: DEFAULT_ZOOM.max,
  zoomStep: DEFAULT_ZOOM.step,
  setZoom: () => {
    throw new Error('setZoom method not implemented')
  },
  setZoomMin: () => {
    throw new Error('setZoomMin method not implemented')
  },
  setZoomMax: () => {
    throw new Error('setZoomMax method not implemented')
  },
  setZoomStep: () => {
    throw new Error('setZoomStep method not implemented')
  }
})

export default ZoomContext
