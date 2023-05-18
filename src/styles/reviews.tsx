import { Colors } from '.'

export const reviewDiv = {
  flexDirection: 'column',
  borderColor: Colors.dark_grey,
  borderStyle: 'solid',
  borderWidth: '2px',
  borderRadius: '12px',
  margin: '0px 0px 20px 0px'
}

export const reviewRowDiv = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  '@media screen and (max-width: 500px)': {
    flexDirection: 'column'
  }
}

export const reviewDetailsDiv = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  '@media screen and (max-width: 1500px)': {
    flexDirection: 'column'
  }
}
