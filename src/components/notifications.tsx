import React, { useState, useContext } from 'react'
import MenuItem from '@mui/material/MenuItem'
import { Colors } from '../styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { OrderStatus, NotificationType, NotificationProps } from '../api/notifications'
import { Components } from '../styles'
import { useNavigate } from 'react-router-dom'
import ReviewModal from './reviewModal'
import UserContext from '../contexts/userContext'
import RequestDetailsModal from './requestDetailsModal'

export const Notification: React.FC<NotificationProps> = props => {
  const [openReviewModal, setOpenReviewModal] = useState(false)
  const [openRequestDetailsModal, setOpenRequestDetailsModal] = useState(false)
  const [currentNotificationID, setCurrentNotificationID] = useState(``)
  const { user } = useContext(UserContext)

  const navigate = useNavigate()

  const handleCloseMenu = () => {
    if (props.handleCloseMenu) {
      props.handleCloseMenu()
    }
  }

  const handleOpenReviewModal = () => {
    handleCloseMenu()
    setCurrentNotificationID(props.notificationID)
    setOpenReviewModal(true)
  }

  const handleCloseReviewModal = () => {
    setOpenReviewModal(false)
    handleDismiss()
  }

  const handleOpenRequestDetailsModal = () => {
    handleCloseMenu()
    setCurrentNotificationID(props.notificationID)
    setOpenRequestDetailsModal(true)
  }

  const handleCloseRequestDetailsModal = () => {
    setOpenRequestDetailsModal(false)
    handleDismiss()
  }

  const handleDismiss = (event?: React.MouseEvent) => {
    event?.stopPropagation() // Stop event from reaching parent
    if (props.onDismiss) {
      if (currentNotificationID === '') {
        props.onDismiss(props.notificationID)
      } else if (currentNotificationID === props.notificationID) {
        props.onDismiss(currentNotificationID)
      }
    }
    setCurrentNotificationID('')
  }

  const handleClick = () => {
    switch (props.notificationType) {
      case NotificationType.NewOrderPlaced:
        navigate(`/orders/${user?.id}`)
        handleDismiss()
        break
      case NotificationType.MoreInfoRequest:
        navigate(`/orders/${user?.id}`)
        handleDismiss()
        break
      case NotificationType.MoreInfoComplete:
        navigate(`/orders/${user?.id}`)
        handleDismiss()
        break
      case NotificationType.OrderCancelled:
        handleDismiss()
        break
      case NotificationType.Review:
        navigate(`/profile/${user?.id}`)
        handleDismiss()
        break
      case NotificationType.OrderUpdate: // These are statuses for the User
        switch (props.status) {
          case OrderStatus.Accepted:
          case OrderStatus.Rejected:
            handleDismiss()
            break
          case OrderStatus.Completed:
            handleCloseMenu()
            handleOpenReviewModal()
            // handleDismiss() // Cuases modal to not open
            break
          case OrderStatus.Failed:
            handleCloseMenu()
            handleOpenReviewModal()
            // handleDismiss() // Same as above
            break
          case OrderStatus.MoreDetailsRequested:
            handleCloseMenu()
            handleOpenRequestDetailsModal()
            // handleDismiss() // Same as above
            break
          default:
            throw new Error('OrderUpdate: Unknown OrderStatus clicked')
        }
        break
      default:
        throw new Error('Unknown notification type clicked')
    }
  }

  const truncateInfo = (info: string, character_limit = 50) => {
    return info.length > character_limit ? info.substring(0, character_limit) + '...' : info
  }

  const renderText = () => {
    switch (props.notificationType) {
      case NotificationType.NewOrderPlaced:
        if (!props.serviceRequest) {
          throw new Error('Missing serviceRequest property')
        }
        return (
          <>
            <b>New Order: </b> {props.serviceRequest?.description}
          </>
        )
      case NotificationType.MoreInfoRequest: // DOESNT GET USED
        return (
          <>
            <b>More Order Information Required</b>
          </>
        )
      case NotificationType.MoreInfoComplete:
        return (
          <>
            <b>More Order Info Provided:</b> {truncateInfo(props.info.substring(22))}
          </>
        )
      case NotificationType.OrderCancelled:
        if (!props.serviceRequest) {
          throw new Error('Missing serviceRequest property')
        }
        return (
          <>
            <b>Order Cancelled:</b> {props.serviceRequest.description}
          </>
        )
      case NotificationType.Review:
        if (!props.serviceRequest) {
          throw new Error('Missing serviceRequest property')
        }
        return (
          <>
            <b>New Review:</b> {props.rating} / 5, &quot;{truncateInfo(props.info)}&quot;
          </>
        )
      case NotificationType.OrderUpdate:
        return (
          <>
            <b>New Status:</b>{' '}
            <Box component="span" sx={{ color: getColorForStatus(props.status) }}>
              {props.status}
            </Box>{' '}
            {props.status !== OrderStatus.MoreDetailsRequested && <>- {props.serviceRequest?.description}</>}
          </>
        )
      default:
        throw new Error(`Unknown Notification Type: ${props}`)
    }
  }

  const getColorForStatus = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Accepted:
        return Colors.green
      case OrderStatus.Rejected:
        return Colors.red
      case OrderStatus.Completed:
        return Colors.green
      case OrderStatus.Failed:
        return Colors.red
      case OrderStatus.MoreDetailsRequested:
        return Colors.orange
      default:
        return Colors.black
    }
  }

  return (
    <>
      <MenuItem onClick={handleClick}>
        <Typography style={Components.notificationTypographyStyle}>{renderText()}</Typography>
        <IconButton edge="end" color="inherit" size="small" onClick={event => handleDismiss(event)}>
          <CloseIcon />
        </IconButton>
      </MenuItem>
      <ReviewModal
        isOpen={openReviewModal}
        requestClose={handleCloseReviewModal}
        existingOrder={props.serviceRequest} // Pass the service request prop from your NotificationProps
      />
      <RequestDetailsModal
        isOpen={openRequestDetailsModal}
        requestClose={handleCloseRequestDetailsModal}
        existingOrder={props.serviceRequest}
      />
    </>
  )
}
