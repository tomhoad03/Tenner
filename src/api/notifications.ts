import { child, get, getDatabase, onValue, push, ref, remove, set } from 'firebase/database'
import { User, UserType } from './user'
import { ServiceRequest, getServiceRequest } from './services'
import { useEffect, useState } from 'react'

export enum NotificationType {
  NewOrderPlaced = 'NewOrderPlaced',
  MoreInfoRequest = 'MoreInfoRequest',
  MoreInfoComplete = 'MoreInfoComplete',
  OrderCancelled = 'OrderCancelled',
  Review = 'Review',
  OrderUpdate = 'OrderUpdate'
}

export enum OrderStatus {
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Completed = 'Completed',
  Failed = 'Failed',
  MoreDetailsRequested = 'More Details Requested'
}

export type NotificationProps = {
  notificationID: string
  user: User
  serviceRequest?: ServiceRequest
  onDismiss?: (id: string) => void
  handleCloseMenu?: () => void
} & (
  | {
      notificationType: NotificationType.NewOrderPlaced
      info: string
    }
  | {
      notificationType: NotificationType.MoreInfoRequest
      info: string
    }
  | {
      notificationType: NotificationType.MoreInfoComplete
      info: string
    }
  | {
      notificationType: NotificationType.OrderCancelled
    }
  | {
      notificationType: NotificationType.Review
      rating: number
      info: string
    }
  | {
      notificationType: NotificationType.OrderUpdate
      status: OrderStatus
      info: string
    }
)

type NewNotificationProps =
  | {
      notificationType: NotificationType.NewOrderPlaced
      info: string
    }
  | {
      notificationType: NotificationType.MoreInfoRequest
      info: string
    }
  | {
      notificationType: NotificationType.MoreInfoComplete
      info: string
    }
  | {
      notificationType: NotificationType.OrderCancelled
    }
  | {
      notificationType: NotificationType.Review
      rating: number
      info: string
    }
  | {
      notificationType: NotificationType.OrderUpdate
      status: OrderStatus
      info: string
    }

export const newNotification = async (notification: NewNotificationProps, user: User, serviceRequestID: string) => {
  const db = getDatabase()
  const notificationRef = push(child(ref(db), `Users/${user.type}/${user.id}/Notification`)).key

  return await new Promise<NotificationProps>((resolve, reject) => {
    if (notificationRef === null) {
      reject(new Error('Failed to create new notification key'))
    } else {
      set(ref(db, `Users/${user.type}/${user.id}/Notifications/${notificationRef}`), {
        ...notification,
        serviceRequestID: serviceRequestID
      })
        .then(() => {
          getServiceRequest(serviceRequestID)
            .then(serviceRequest => {
              resolve({ notificationID: notificationRef, user: user, serviceRequest: serviceRequest, ...notification })
            })
            .catch(err => {
              reject(err)
            })
        })
        .catch(err => {
          reject(err)
        })
    }
  })
}

export const useGetNotifications = (user: User) => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([])
  const db = getDatabase()

  useEffect(() => {
    const loadData = () => {
      const notificationsRef = ref(db, `Users/${user.type}/${user.id}/Notifications`)
      const unsubscribe = onValue(notificationsRef, (snapshot: any) => {
        const notificationsData = snapshot.val()
        const notifications: Promise<NotificationProps>[] = []

        for (const id in notificationsData) {
          const notification = notificationsData[id]

          if (!notification.serviceRequestID) {
            notifications.push({ notificationID: id, user: user, ...notification })
          } else {
            const serviceRequestPromise = getServiceRequest(notification.serviceRequestID)
              .then(result => {
                return { notificationID: id, user: user, serviceRequest: result, ...notification }
              })
              .catch(err => Promise.reject(err))

            notifications.push(serviceRequestPromise)
          }
        }

        Promise.all(notifications).then(result => setNotifications(result))
      })
      return () => {
        unsubscribe()
      }
    }

    loadData()
  }, [user])

  return notifications
}

export const getNotifications = async (user: User) => {
  const db = getDatabase()
  const notificationsRef = ref(db, `Users/${user.type}/${user.id}/Notifications`)

  return await new Promise<NotificationProps[]>((resolve, reject) => {
    get(notificationsRef)
      .then(snapshot => {
        const notificationsData = snapshot.val()
        const notifications: Promise<NotificationProps>[] = []

        for (const id in notificationsData) {
          const notification = notificationsData[id]

          if (!notification.serviceRequestID) {
            notifications.push({ notificationID: id, user: user, ...notification })
          } else {
            const serviceRequestPromise = getServiceRequest(notification.serviceRequestID)
              .then(result => {
                return { notificationID: id, user: user, serviceRequest: result, ...notification }
              })
              .catch(err => Promise.reject(err))

            notifications.push(serviceRequestPromise)
          }
        }

        Promise.all(notifications)
          .then(result => resolve(result))
          .catch(err => reject(err))
      })
      .catch(err => reject(err))
  })
}

export const removeNotification = (notificationID: string, userID: string, userType: UserType) => {
  const db = getDatabase()
  const notificationRef = ref(db, `Users/${userType}/${userID}/Notifications/${notificationID}`)
  remove(notificationRef)
    .then(() => console.log('Successfully removed notification: ', notificationID))
    .catch(err => console.log('Failed to remove notification: ', notificationID, err))
}
