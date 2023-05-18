import SearchIcon from '@mui/icons-material/Search'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Paths from '../paths'
import { useSearchParams } from 'react-router-dom'

interface HeaderSearchBoxProps {
  iconBackgroundColor?: string
}

const HeaderSearchBox: React.FC<HeaderSearchBoxProps> = ({ iconBackgroundColor }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.get('query')?.trim())
  const navigate = useNavigate()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
  }

  const handleSubmit = () => {
    const params = new URLSearchParams()
    params.append('query', searchValue || '')
    navigate(`${Paths.Services}?${params.toString()}`)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', borderRadius: 4, height: 40 }}>
      <TextField
        value={searchValue}
        onChange={handleChange}
        placeholder="What service are you looking for today?"
        style={{ width: 400, textAlign: 'center', background: 'white', borderRadius: 4 }}
        size="small"
        onKeyPress={event => {
          if (event.key === 'Enter') {
            handleSubmit()
          }
        }}
        InputProps={{
          style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
        }}
      />
      <IconButton
        size="large"
        type="submit"
        onClick={handleSubmit}
        style={{ margin: 8, background: iconBackgroundColor ?? 'black', borderRadius: 4, height: 40 }}>
        <SearchIcon style={{ color: 'white' }} />
      </IconButton>
    </div>
  )
}

export default HeaderSearchBox
