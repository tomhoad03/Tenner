import { Colors } from '.'

export const orderDiv = {
  display: 'flex',
  flexDirection: 'column',
  borderColor: Colors.dark_grey,
  borderStyle: 'solid',
  borderWidth: '2px',
  borderRadius: '12px',
  margin: '0px 0px 20px 0px',
  padding: '10px 10px 10px 10px'
}

export const orderRowDiv = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  '@media screen and (max-width: 2000px)': {
    flexDirection: 'column'
  }
}

export const orderButtonsDiv = {
  width: '50%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly'
}
