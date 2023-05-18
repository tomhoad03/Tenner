import React, { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Avatar from '@mui/material/Avatar'

interface AccountMenuProps {
  handleProfile: () => void
  handleOrderHistory: () => void
  handleLogout: () => void
  buttonStyle: React.CSSProperties
  avatarSource: string
}

const AccountMenu: React.FC<AccountMenuProps> = ({ handleProfile, handleOrderHistory, handleLogout, avatarSource }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Avatar src={avatarSource} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: '25ch'
          }
        }}>
        <MenuItem
          onClick={() => {
            handleClose()
            handleProfile()
          }}>
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose()
            handleOrderHistory()
          }}>
          Order History
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose()
            handleLogout()
          }}>
          Logout
        </MenuItem>
      </Menu>
    </>
  )
}

export default AccountMenu
