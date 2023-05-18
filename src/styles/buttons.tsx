import * as Colors from './colors'

export const myButton = {
  color: Colors.green,
  margin: {
    top: 5,
    right: 0,
    bottom: 0,
    left: '1rem'
  },
  '& span': {
    fontWeight: 'bold'
  }
}

// Green button used for continue / submitting etc.
export const greenButton: React.CSSProperties = {
  backgroundColor: Colors.green,
  borderRadius: '16px',
  color: 'white',
  fontFamily: 'Poppins',
  fontWeight: 'bold',
  fontSize: '18px',
  border: 'none',
  height: 'auto',
  minHeight: '50px',
  width: '100%',
  cursor: 'pointer'
}

// Black button used for cancelling / extra details etc.
export const blackButton: React.CSSProperties = {
  backgroundColor: 'black',
  borderRadius: '16px',
  color: 'white',
  fontFamily: 'Poppins',
  fontWeight: 'bold',
  fontSize: '18px',
  border: 'none',
  height: 'auto',
  minHeight: '50px',
  width: '100%',
  cursor: 'pointer'
}

// Invisible button so only the icon is shown
export const iconButton: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  background: 'none',
  padding: 0,
  outline: 'none',
  cursor: 'pointer'
}

export const headerOnSplashButton: React.CSSProperties = {
  color: Colors.white
}

export const headerOnSplashSpecialButton: React.CSSProperties = {
  color: Colors.white,
  borderColor: Colors.white
}

export const headerOffSplashButton: React.CSSProperties = {
  color: Colors.black
}

export const headerOffSplashSpecialButton: React.CSSProperties = {
  color: Colors.green,
  borderColor: Colors.green
}
