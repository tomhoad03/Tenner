import { createTheme, Theme } from '@mui/material/styles'
import * as Colors from './colors'

const theme: Theme = createTheme({
  palette: {
    primary: {
      main: Colors.main
    },
    secondary: {
      main: Colors.secondary
    }
  },
  typography: {
    fontFamily: 'Poppins, sans-serif'
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          textTransform: 'none'
        },
        containedPrimary: {
          backgroundColor: Colors.main,
          color: Colors.white,
          fontWeight: 'bold'
        }
      }
    }
  }
})

export default theme
