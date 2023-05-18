import React, { useEffect, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Badge from '@mui/material/Badge'
import { Notification } from './notifications'
import { NotificationProps, getNotifications, removeNotification, useGetNotifications } from '../api/notifications'
import { MenuItem, Typography } from '@mui/material'
import { Components } from '../styles'
import { User } from '../api/user'

interface NotificationsMenuProps {
  style?: React.CSSProperties
  user: User
}

const NotificationsMenu: React.FC<NotificationsMenuProps> = ({ style, user }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const notifications = useGetNotifications(user)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDismiss = (id: string) => {
    removeNotification(id, user.id, user.type)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={notifications.length} color="primary">
          <NotificationsNoneIcon style={style} />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl) && !menuOpen}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: '30ch',
            overflowWrap: 'break-word',
            whiteSpace: 'normal'
          }
        }}>
        {notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography style={Components.notificationTypographyStyle}>
              All caught up! No more notifications.
            </Typography>
          </MenuItem>
        ) : (
          notifications.map(notification => (
            <Notification
              key={notification.notificationID}
              {...notification}
              onDismiss={handleDismiss}
              handleCloseMenu={handleClose}
            />
          ))
        )}
      </Menu>
    </>
  )
}

export default NotificationsMenu
