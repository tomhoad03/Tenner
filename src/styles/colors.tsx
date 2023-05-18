//TODO - clean up grays
export const gray = '#404145'
export const light_gray = '#707070'
export const pale_gray = '#E4E5E7'
export const another_gray = '#222325'
export const blueish_gray = '#94ACC3'
export const dark_grey = '#74767E'
export const gold = '#F6C06C'
export const green = '#1DBF73'
export const red = '#D65454'
export const orange = '#E59928'
export const slate = '#404145'
export const white = 'white'
export const black = 'black'
export const blue = '#2A4CC6'
export const main = green
export const secondary = another_gray
export const transparent = 'transparent'

// https://stackoverflow.com/questions/21646738/convert-hex-to-rgba
// Author: AJFarkas
export function hexToRGB(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16)

  if (alpha) {
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')'
  } else {
    return 'rgb(' + r + ', ' + g + ', ' + b + ')'
  }
}
