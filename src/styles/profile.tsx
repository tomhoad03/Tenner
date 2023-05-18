export const mainDiv = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontFamily: 'Poppins',
  padding: '50px 10% 50px 10%',
  '@media screen and (max-width: 1000px)': {
    padding: '25px 5% 25px 5%'
  }
}

export const rowDiv = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  '@media screen and (max-width: 1000px)': {
    flexDirection: 'column',
    alignItems: 'center'
  }
}

export const columnDiv = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  '@media screen and (max-width: 1000px)': {
    flexDirection: 'column',
    alignItems: 'start'
  }
}

export const borderedDiv = {
  display: 'flex',
  flexDirection: 'column',
  width: '50%',
  padding: '10px 10px 0px 10px',
  '@media screen and (max-width: 1000px)': {
    width: '100%'
  }
}

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
