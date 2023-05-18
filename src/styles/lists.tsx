import { Colors } from '.'
import { SxProps } from '@mui/system'
import { Theme } from '@mui/material'

export const locationSuggestionDropdownListStyle: SxProps<Theme> = {
  maxHeight: 'calc(3 * 48px)', // Assuming each ListItem is 48px in height
  overflowY: 'auto',
  overflowX: 'hidden',
  backgroundColor: Colors.white
}
