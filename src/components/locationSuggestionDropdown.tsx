import React, { useEffect, useState, useContext } from 'react'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import { Box } from '@mui/system'
import Skeleton from '@mui/material/Skeleton'
import { Lists } from '../styles'
import LocationContext from '../contexts/locationContext'

// TODO - Refactor, really horrible

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search?'
const SEARCH_DELAY = 0.2

interface LocationDropdownItem {
  place_id: string
  display_name: string
  lat: string
  lon: string
}

interface LocationSuggestionDropdownProps {
  searchText: string | null
  onLocationSelect: (name: string, lat: number, lng: number) => void
}

const LocationSuggestionDropdown: React.FC<LocationSuggestionDropdownProps> = ({ searchText, onLocationSelect }) => {
  const [listPlace, setListPlace] = useState<LocationDropdownItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const locationContext = useContext(LocationContext)
  const { name: currentName, lat: currentLat, lng: currentLng } = locationContext.location

  useEffect(() => {
    if (searchText != currentName) {
      const abortController = new AbortController()
      const searchTimeout = setTimeout(() => {
        setListPlace([])
        setIsLoading(false)
        handleSearch(abortController.signal)
      }, SEARCH_DELAY * 1000) as unknown as NodeJS.Timeout
      return () => {
        clearTimeout(searchTimeout)
        abortController.abort()
      }
    }
  }, [searchText])

  const handleSearchResult = (result: LocationDropdownItem[]) => {
    setIsLoading(false)
    if (
      result.length > 0 &&
      !(
        result[0].display_name === searchText &&
        parseFloat(result[0].lat) === currentLat &&
        parseFloat(result[0].lon) === currentLng
      )
    ) {
      setListPlace(result)
    }
  }

  const handleSearch = async (signal: AbortSignal) => {
    if (searchText === null) {
      return
    } else {
      const params = new URLSearchParams({
        q: searchText,
        format: 'json',
        addressdetails: '1',
        polygon_geojson: '0'
      })
      const requestOptions: RequestInit = {
        method: 'GET',
        redirect: 'follow',
        signal
      }
      try {
        setIsLoading(true)
        const response = await fetch(`${NOMINATIM_BASE_URL}${params.toString()}`, requestOptions)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const result: LocationDropdownItem[] = await response.json()
        handleSearchResult(result)
      } catch (error) {
        setIsLoading(false)
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error fetching data:', error)
        }
      }
    }
  }

  const handleLocationSelect = (selectedLocation: LocationDropdownItem) => {
    setListPlace([])
    setIsLoading(false)
    onLocationSelect(selectedLocation.display_name, parseFloat(selectedLocation.lat), parseFloat(selectedLocation.lon))
  }

  return listPlace.length > 0 ? (
    <Box sx={{ width: '100%' }}>
      <List component="nav" aria-label="suggested locations" sx={Lists.locationSuggestionDropdownListStyle}>
        {isLoading ? (
          <ListItemButton>
            <Skeleton variant="text" width="100%" />
          </ListItemButton>
        ) : (
          listPlace.map(item => (
            <React.Fragment key={item.place_id}>
              <ListItemButton
                onClick={() => {
                  handleLocationSelect(item)
                }}>
                <ListItemText primary={item.display_name} />
              </ListItemButton>
              <Divider />
            </React.Fragment>
          ))
        )}
      </List>
    </Box>
  ) : null
}

export default LocationSuggestionDropdown
