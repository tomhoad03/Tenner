import React from 'react'
import Button from '@mui/material/Button'
import { User } from '../api/user'
import { NotificationType, newNotification } from '../api/notifications'
import { OrderStatus } from '../api/notifications'

interface NotificationTestButtonProps {
  user: User
}

const NotificationTestButton: React.FC<NotificationTestButtonProps> = ({ user }) => {
  const handleCreateNotifications = () => {
    const serviceRequestID = '-NURM1vLK0PDBQqEK0Uj'

    // New order placed
    newNotification(
      {
        notificationType: NotificationType.NewOrderPlaced,
        info: 'New order placed'
      },
      user,
      serviceRequestID
    )
      .then(notification => console.log('Notification made: ', notification))
      .catch(err => console.log(err))

    // Order cancelled
    newNotification(
      {
        notificationType: NotificationType.OrderCancelled
      },
      user,
      serviceRequestID
    )
      .then(notification => console.log('Notification made: ', notification))
      .catch(err => console.log(err))

    // Review
    newNotification(
      {
        notificationType: NotificationType.Review,
        rating: 4.5,
        info: 'Good service'
      },
      user,
      serviceRequestID
    )
      .then(notification => console.log('Notification made: ', notification))
      .catch(err => console.log(err))

    // Order status changes
    const orderStatuses: OrderStatus[] = [
      OrderStatus.Accepted,
      OrderStatus.Rejected,
      OrderStatus.Completed,
      OrderStatus.Failed,
      OrderStatus.MoreDetailsRequested
    ]

    orderStatuses.forEach(status => {
      newNotification(
        {
          notificationType: NotificationType.OrderUpdate,
          status: status,
          info: `Order status changed to ${status}`
        },
        user,
        serviceRequestID
      )
        .then(notification => console.log('Notification made: ', notification))
        .catch(err => console.log(err))
    })
  }

  return (
    <Button onClick={handleCreateNotifications} variant="contained">
      Create Notifications
    </Button>
  )
}

export default NotificationTestButton
