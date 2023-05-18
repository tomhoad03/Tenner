import { PointTuple } from 'leaflet'
import * as Colors from './colors'

export const modal: ReactModal.Styles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  content: {
    backgroundColor: '#fff',
    padding: '20px',
    width: '80%',
    maxWidth: '600px',
    borderRadius: '16px',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    margin: '0 auto',
    overflow: 'auto'
  }
}

export const separator: React.CSSProperties = {
  flex: 1,
  borderBottom: `3px solid ${Colors.pale_gray}`,
  margin: '10px 0'
}

export const verticalSeparator: React.CSSProperties = {
  flex: '0 0 auto',
  borderLeft: `3px solid ${Colors.pale_gray}`,
  margin: '0 10px',
  height: '100%'
}

export const textField: React.CSSProperties = {
  borderRadius: '10px',
  border: `3px solid ${Colors.pale_gray}`,
  boxSizing: 'border-box',
  outline: 'none',
  minHeight: '40px',
  maxHeight: '40px',
  color: Colors.light_gray,
  fontFamily: 'Poppins',
  padding: '4px',
  width: '100%',
  transition: 'border-color 0.1s'
}

export const textArea: React.CSSProperties = {
  borderRadius: '10px',
  border: `3px solid ${Colors.pale_gray}`,
  boxSizing: 'border-box',
  outline: 'none',
  color: Colors.light_gray,
  fontFamily: 'Poppins',
  padding: '4px',
  width: '100%',
  resize: 'none',
  transition: 'border-color 0.1s'
}

export const locationPickerCircle = {
  color: Colors.blueish_gray,
  fillColor: Colors.hexToRGB(Colors.blueish_gray, 0.2),
  fillOpacity: 1,
  weight: 3
}

export const locationIcon = {
  iconUrl: 'https://i.pinimg.com/originals/7f/6c/dc/7f6cdce4c15b2d1548b618ce5573bfd3.png',
  iconSize: [45, 25] as PointTuple,
  iconAnchor: [21, 25] as PointTuple
}

export const mapContainer = { height: '100%', width: '100%' }

export const notificationTypographyStyle: React.CSSProperties = {
  overflowWrap: 'break-word',
  whiteSpace: 'normal',
  flexGrow: 1,
  marginRight: '0.5rem'
}
