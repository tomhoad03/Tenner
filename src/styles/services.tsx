import { Colors } from '.'

export const columnHeaderDiv = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  height: 'auto',
  minHeight: '50px',
  '@media screen and (max-width: 1000px)': {
    flexDirection: 'column',
    alignItems: 'center'
  }
}

export const searchServices = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center'
}

export const serviceDiv = {
  display: 'flex',
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  borderColor: Colors.dark_grey,
  borderStyle: 'solid',
  borderWidth: '2px',
  borderRadius: '12px',
  margin: '0px 0px 20px 0px'
}

export const serviceImage = {
  borderRadius: '12px',
  width: '50%',
  height: '100%',
  aspectRatio: 5 / 3,
  objectFit: 'cover',
  '@media screen and (max-width: 1500px)': {
    visibility: 'hidden',
    width: '0%'
  }
}

export const rightServiceDiv = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '10px 10px 10px 10px',
  width: '100%'
}

export const serviceDetailsDiv = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0px 5px 0px 5px'
}

export const serviceProviderNameDiv = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '80%'
}
