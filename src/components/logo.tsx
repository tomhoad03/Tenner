import Button from '@mui/material/Button'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Paths from '../paths'

interface LogoProps {
  color?: string
}

const Logo: React.FC<LogoProps> = ({ color = '#404145' }) => {
  const navigate = useNavigate()

  return (
    <Button
      onClick={() => navigate(Paths.Launchpad)}
      sx={{
        paddingTop: 0,
        paddingBottom: 0,
        minWidth: 'auto',
        textTransform: 'none', // Prevent auto-capitalise
        '&:hover': {
          backgroundColor: 'transparent'
        }
      }}>
      <span
        style={{
          fontFamily: 'Open Sans',
          fontSize: '40px',
          letterSpacing: '-4px',
          color,
          fontWeight: 600
        }}>
        tenner
        <span
          style={{
            color: '#1DBF42',
            fontWeight: 1200
          }}>
          .
        </span>
      </span>
    </Button>
  )
}

export default Logo
