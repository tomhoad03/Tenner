import { Colors } from '.'

export const servicesDiv = {
  display: 'flex',
  'flex-direction': 'column',
  width: '50%',
  padding: '0px 10px 0px 10px',
  '@media screen and (max-width: 1000px)': {
    width: '100%'
  }
}

export const servicesDetailsDiv = {
  display: 'flex',
  'flex-direction': 'row',
  'justify-content': 'space-between',
  width: '100%',
  '@media screen and (max-width: 1000px)': {
    'flex-direction': 'column',
    'align-items': 'center'
  }
}

export const searchServices = {
  display: 'flex',
  'flex-direction': 'row',
  'justify-content': 'space-between',
  'align-items': 'center'
}

export const searchBar = {
  margin: '0px 5px 0px 0px'
}

export const serviceDiv = {
  display: 'flex',
  width: '100%',
  'flex-direction': 'row',
  'justify-content': 'space-between',
  'border-color': Colors.dark_grey,
  'border-style': 'solid',
  'border-width': '2px',
  'border-radius': '12px',
  margin: '0px 0px 20px 0px'
}

export const serviceImage = {
  'border-radius': '12px',
  width: '60%',
  height: '100%',
  '@media screen and (max-width: 1500px)': {
    visibility: 'hidden',
    width: '0%'
  }
}

export const rightServiceDiv = {
  display: 'flex',
  'flex-direction': 'column',
  'justify-content': 'space-between',
  padding: '5px 10px 5px 5px',
  width: '100%'
}

export const serviceProviderDetailsDiv = {
  display: 'flex',
  'flex-direction': 'row',
  'align-items': 'center',
  'justify-content': 'space-between',
  padding: '0px 5px 0px 5px'
}

export const serviceProviderNameDiv = {
  display: 'flex',
  'flex-direction': 'row',
  'align-items': 'center'
}

export const serviceDetailsDiv = {
  display: 'flex',
  'flex-direction': 'row',
  'align-items': 'center',
  'justify-content': 'space-between',
  padding: '0px 5px 0px 5px'
}

export const serviceName = {
  padding: '0px 50px 0px 10px'
}

export const serviceDescription = {
  padding: '0px 0px 0px 10px'
}

export const price = {
  padding: '0px 0px 0px 10px'
}
