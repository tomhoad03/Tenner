import React from 'react'
import Button from '@mui/material/Button'
import NotificationsMenu from './notificationsMenu'
import AccountMenu from './accountMenu'
import { Buttons } from '../styles'
import { User } from '../api/user'

interface ExtraButtonsProps {
  user: User | null
  isOnSplash: boolean
  handleSignIn: () => void
  handleServices: () => void
  handleJoin: () => void
  handleLogout: () => void
  handleProfile: () => void
  handleOrderHistory: () => void
  avatarSource: string
}

const extraButtonsDivStyle = { display: 'flex', alignItems: 'center', gap: '0.5rem' }

const ExtraButtons: React.FC<ExtraButtonsProps> = ({
  user,
  isOnSplash,
  handleSignIn,
  handleServices,
  handleJoin,
  handleProfile,
  handleOrderHistory,
  handleLogout,
  avatarSource
}) => {
  const buttonStyle = isOnSplash ? Buttons.headerOnSplashButton : Buttons.headerOffSplashButton
  const specialButtonStyle = isOnSplash ? Buttons.headerOnSplashSpecialButton : Buttons.headerOffSplashSpecialButton

  if (user) {
    return (
      <div style={extraButtonsDivStyle}>
        {/* <NotificationTestButton user={user} /> */}
        <NotificationsMenu style={buttonStyle} user={user} />
        <Button style={buttonStyle} onClick={handleServices}>
          Services
        </Button>
        <AccountMenu
          handleProfile={handleProfile}
          handleOrderHistory={handleOrderHistory}
          handleLogout={handleLogout}
          buttonStyle={buttonStyle}
          avatarSource={avatarSource}
        />
      </div>
    )
  }

  return (
    <div style={extraButtonsDivStyle}>
      <Button style={buttonStyle} onClick={handleServices}>
        Services
      </Button>
      <Button style={buttonStyle} onClick={handleSignIn}>
        Sign in
      </Button>
      <Button style={specialButtonStyle} variant="outlined" onClick={handleJoin}>
        Join
      </Button>
    </div>
  )
}

export default ExtraButtons
