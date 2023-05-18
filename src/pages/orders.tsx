import React, { useContext, SetStateAction, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createUseStyles } from 'react-jss'
import { getCustomers, getUser, User } from '../api/user'
import {
  getAllServiceReviews,
  getServiceRequests,
  getServices,
  RequestStatus,
  Service,
  ServiceRequest,
  ServiceReview,
  updateServiceRequest
} from '../api/services'
import { StarRatingComponent, PersonalDetailsComponent } from '../components/'
import { GreenButton, BlackButton, IconButton } from '../components/buttons'
import ReviewModal, { ReviewModalState } from '../components/reviewModal'
import { Colors, ProfileStyle, OrdersStyle } from '../styles'
import { modalSubtitle, subheading } from '../styles/labels'
import RequestDetailsModal, { RequestDetailsModalState } from '../components/requestDetailsModal'
import UserContext from '../contexts/userContext'
import { OrderStatus, newNotification } from '../api/notifications'
import { NotificationType } from '../api/notifications'
import { getAuth, onAuthStateChanged } from '@firebase/auth'

const useStyles = createUseStyles({ ...ProfileStyle })
const useOrdersStyles = createUseStyles({ ...OrdersStyle })

/**
 * Orders constructor
 */
const Orders = () => {
  const { uid } = useParams()
  const classes = useStyles()
  const navigate = useNavigate()
  const [isPublic, setIsPublic] = useState<boolean>(true)
  const [isCustomer, setIsCustomer] = useState<boolean>(true)
  const [isApproved, setIsApproved] = useState<boolean>(false)
  const [updateOrder, setUpdateOrder] = useState<ServiceRequest>()
  const [users, setUsers] = useState<User[] | null>([])
  const [services, setServices] = useState<Service[] | null>([])
  const [reviews, setReviews] = useState<ServiceReview[] | null>([])
  const [orders, setOrders] = useState<ServiceRequest[] | null>([])

  // Gets the profile user
  useEffect(() => {
    if (uid != null) {
      getUser(uid)
        .then(user => {
          // Checks if the profile is public
          const auth = getAuth()
          onAuthStateChanged(auth, user => {
            setIsPublic(user?.uid !== uid)
          })

          setIsCustomer(user?.type == 'Customer')
          setIsApproved(user.status == 'Approved' || user?.type == 'Customer')
        })
        .catch(err => console.log(err))
    }

    // Gets all the service requests
    getServiceRequests()
      .then(orders => {
        setOrders(orders)
      })
      .catch(err => console.log(err))

    // Gets all the customers
    getCustomers()
      .then(users => {
        setUsers(users)
      })
      .catch(err => console.log(err))

    // Gets all the reviews
    getAllServiceReviews()
      .then(reviews => {
        setReviews(reviews)
      })
      .catch(err => console.log(err))

    // Gets all the services
    getServices()
      .then(services => {
        setServices(services)
      })
      .catch(err => console.log(err))
  }, [])

  return (
    <div>
      <hr style={{ width: '100%' }} />
      <div style={{ display: 'flex', flexDirection: 'row', padding: '10px 10% 10px 10%' }}>
        <IconButton
          onClick={() => navigate(`/profile/${uid}`)}
          style={{ ...modalSubtitle, marginRight: '20px', color: 'grey' }}>
          Profile
        </IconButton>
        <IconButton onClick={() => navigate(`/orders/${uid}`)} style={{ ...modalSubtitle, color: 'black' }}>
          Orders
        </IconButton>
      </div>
      <hr style={{ width: '100%' }} />
      <div className={classes.mainDiv}>
        <div className={classes.rowDiv}>
          <div className={classes.borderedDiv}>
            {' '}
            <div key="headerDiv" className={classes.columnHeaderDiv}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h2 key="title" style={{ ...subheading }}>
                  Active Orders
                </h2>
              </div>
            </div>
            {createOrdersSection(
              uid as string,
              isPublic,
              isCustomer,
              isApproved,
              false,
              updateOrder,
              setUpdateOrder,
              users,
              services,
              reviews,
              orders
            )}
          </div>
          <div className={classes.borderedDiv}>
            <div key="headerDiv" className={classes.columnHeaderDiv}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h2 key="title" style={{ ...subheading }}>
                  Completed Orders
                </h2>
              </div>
            </div>
            {createOrdersSection(
              uid as string,
              isPublic,
              isCustomer,
              isApproved,
              true,
              updateOrder,
              setUpdateOrder,
              users,
              services,
              reviews,
              orders
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Display the providers or customers individual orders
 * @param uid The user id
 * @param isPublic Is the profile being viewed publicly
 * @param isCustomer Is the profile a customer or provider
 * @param isApproved Is the profile approved
 * @param isCompleted Is the list of orders completed
 * @param updateOrder The order to update
 * @param setUpdateOrder The method to set the update order
 *
 * TODO replace with simplified database calls
 * @param users The list of all users
 * @param services The list of all services
 * @param reviews The list of all reviews
 * @param orders The list of all orders
 */
const createOrdersSection = (
  uid: string,
  isPublic: boolean,
  isCustomer: boolean,
  isApproved: boolean,
  isCompleted: boolean,
  updateOrder: ServiceRequest | undefined,
  setUpdateOrder: React.Dispatch<SetStateAction<ServiceRequest | undefined>>,
  users: User[] | null,
  services: Service[] | null,
  reviews: ServiceReview[] | null,
  orders: ServiceRequest[] | null
) => {
  const classes = useOrdersStyles()
  const [reviewModalState, setReviewModalState] = useState<ReviewModalState>(undefined)
  const [requestDetailsModalState, setRequestDetailsModalState] = useState<RequestDetailsModalState>(undefined)
  const [existingOrder, setExistingOrder] = useState<ServiceRequest>()
  const [canUpdate, setCanUpdate] = useState<boolean>(false)
  const { user } = useContext(UserContext) // Current logged in user

  useEffect(() => {
    // Updates an order
    {
      canUpdate && updateOrder != undefined ? updateServiceRequest(updateOrder) : null
    }
    setCanUpdate(false)
  }, [updateOrder])

  return (
    <>
      <ReviewModal
        isOpen={reviewModalState !== undefined}
        requestClose={() => {
          setReviewModalState(undefined)
        }}
        existingOrder={existingOrder}
      />
      <RequestDetailsModal
        isOpen={requestDetailsModalState !== undefined}
        requestClose={() => {
          setRequestDetailsModalState(undefined)
        }}
        existingOrder={existingOrder}
      />
      {orders?.map((order, index) => {
        // Hides orders not belonging to the authed user
        if (isPublic || (isCustomer && order.customerID !== uid) || (!isCustomer && order.providerID !== uid)) {
          return null
        }

        // Display settings for completed orders
        if (
          isCompleted &&
          order.status !== RequestStatus.Delivered &&
          order.status !== RequestStatus.Rejected &&
          order.status !== RequestStatus.Cancelled
        ) {
          if (isCustomer || order.status !== RequestStatus.RequestReview) {
            return null
          }
        }

        // Display settings for incomplete orders
        if (
          !isCompleted &&
          order.status !== RequestStatus.Pending &&
          order.status !== RequestStatus.Approved &&
          order.status !== RequestStatus.RequestDetails
        ) {
          if (!isCustomer || order.status !== RequestStatus.RequestReview) {
            return null
          }
        }

        // Get the customer and rating and service
        const user = users?.find(user => user.id == order.customerID)
        const review = reviews?.find(review => review.id == order.reviewID)
        const rating = review !== undefined ? review.rating : NaN
        const service = services?.find(service => service.id == order.serviceID)

        return (
          <div key={index + 'div'} className={classes.orderDiv}>
            <div key={index + 'header'} className={classes.orderRowDiv}>
              <h3
                key={index + 'username'}
                style={{ ...subheading, width: '55%', textOverflow: 'ellipsis', overflow: 'clip' }}>
                {service?.name}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <h2 key={index + 'status'} className={'text-1xl font-semibold'}>
                  Status:
                </h2>

                {order.status == RequestStatus.Pending ? (
                  <h2 key={index + 'approval'} style={{ color: Colors.orange, marginLeft: '15px' }}>
                    {'Awaiting Response'}
                  </h2>
                ) : null}

                {order.status == RequestStatus.Rejected ? (
                  <h2 key={index + 'approval'} style={{ color: Colors.red, marginLeft: '15px' }}>
                    {'Rejected'}
                  </h2>
                ) : null}

                {order.status == RequestStatus.Approved ? (
                  isCustomer ? (
                    <h2 key={index + 'approval'} style={{ color: Colors.green, marginLeft: '15px' }}>
                      {'Awaiting Delivery'}
                    </h2>
                  ) : (
                    <h2 key={index + 'approval'} style={{ color: Colors.orange, marginLeft: '15px' }}>
                      {'Awaiting Delivery'}
                    </h2>
                  )
                ) : null}

                {order.status == RequestStatus.Cancelled ? (
                  <h2 key={index + 'approval'} style={{ color: Colors.red, marginLeft: '15px' }}>
                    {'Cancelled'}
                  </h2>
                ) : null}

                {order.status == RequestStatus.RequestDetails ? (
                  isCustomer ? (
                    <h2 key={index + 'approval'} style={{ color: Colors.orange, marginLeft: '15px' }}>
                      {'More Details Requested'}
                    </h2>
                  ) : (
                    <h2 key={index + 'approval'} style={{ color: Colors.green, marginLeft: '15px' }}>
                      {'Awaiting Response'}
                    </h2>
                  )
                ) : null}

                {order.status == RequestStatus.RequestReview ? (
                  isCustomer ? (
                    <h2 key={index + 'approval'} style={{ color: Colors.orange, marginLeft: '15px' }}>
                      {'Review Requested'}
                    </h2>
                  ) : (
                    <>
                      <h2 key={index + 'approval'} style={{ color: Colors.green, marginLeft: '15px' }}>
                        {'Delivered'}
                      </h2>
                      <h2 key={index + 'approved'} style={{ color: Colors.black, marginLeft: '15px' }}>
                        {'(Awaiting Review)'}
                      </h2>
                    </>
                  )
                ) : null}

                {order.status == RequestStatus.Delivered ? (
                  <>
                    <h2 key={index + 'approval'} style={{ color: Colors.green, marginLeft: '15px' }}>
                      {'Delivered'}
                    </h2>
                    <p key={index + 'approvedA'} style={{ display: 'flex', color: Colors.black, marginLeft: '15px' }}>
                      {'('}
                    </p>
                    <div>
                      <StarRatingComponent rating={rating} />
                    </div>
                    <p key={index + 'approvedB'} style={{ display: 'flex', color: Colors.black }}>
                      {')'}
                    </p>
                  </>
                ) : null}

                {!isApproved ? (
                  <h2 key={index + 'approved'} style={{ color: Colors.black, marginLeft: '15px' }}>
                    {'(Awaiting Profile Approval)'}
                  </h2>
                ) : null}
              </div>
            </div>
            <p key={index + 'order'}>{order.description}</p>
            <div key={index + 'details'} className={classes.orderRowDiv}>
              <PersonalDetailsComponent
                username={user?.username}
                location={user?.location}
                status={user?.status}
                isServiceProvider={false}
              />

              {order.status == RequestStatus.Pending && isApproved ? (
                isCustomer ? (
                  <div key={index + 'buttons'} style={{ width: '50%' }} />
                ) : (
                  <div key={index + 'buttons'} className={classes.orderButtonsDiv}>
                    <GreenButton
                      key={index + 'approve'}
                      onClick={() => {
                        setCanUpdate(true)
                        order.status = RequestStatus.Approved
                        setUpdateOrder(order)
                        getUser(order.customerID)
                          .then(user => {
                            return newNotification(
                              {
                                notificationType: NotificationType.OrderUpdate,
                                status: OrderStatus.Accepted,
                                info: 'Order status changed to Accepted'
                              },
                              user,
                              order.id
                            )
                          })
                          .then(notification => console.log('Notification made: ', notification))
                          .catch(err => console.log(err))
                      }}
                      title="Approve"
                      id={index + 'approve'}
                    />
                    <BlackButton
                      key={index + 'reject'}
                      onClick={() => {
                        setCanUpdate(true)
                        order.status = RequestStatus.Rejected
                        setUpdateOrder(order)
                        getUser(order.customerID)
                          .then(user => {
                            return newNotification(
                              {
                                notificationType: NotificationType.OrderUpdate,
                                status: OrderStatus.Rejected,
                                info: 'Order status changed to Rejected'
                              },
                              user,
                              order.id
                            )
                          })
                          .then(notification => console.log('Notification made: ', notification))
                          .catch(err => console.log(err))
                      }}
                      title="Reject"
                      id={index + 'reject'}
                      style={{ marginTop: '5px' }}
                    />
                  </div>
                )
              ) : null}

              {order.status == RequestStatus.Approved && isApproved ? (
                isCustomer ? (
                  <div key={index + 'buttons'} style={{ width: '50%' }} />
                ) : (
                  <div key={index + 'buttons'} className={classes.orderButtonsDiv}>
                    <GreenButton
                      key={index + 'deliver'}
                      onClick={() => {
                        setCanUpdate(true)
                        order.status = RequestStatus.RequestReview
                        setUpdateOrder(order)
                        getUser(order.customerID)
                          .then(user => {
                            return newNotification(
                              {
                                notificationType: NotificationType.OrderUpdate,
                                status: OrderStatus.Completed,
                                info: 'Order completed. Please leave a review.'
                              },
                              user,
                              order.id
                            )
                          })
                          .then(notification => console.log('Notification made: ', notification))
                          .catch(err => console.log(err))
                      }}
                      title="Deliver"
                      id={index + 'deliver'}
                    />
                    <BlackButton
                      key={index + 'cancel'}
                      onClick={() => {
                        setCanUpdate(true)
                        order.status = RequestStatus.Cancelled
                        setUpdateOrder(order)
                        getUser(order.customerID)
                          .then(user => {
                            return newNotification(
                              {
                                notificationType: NotificationType.OrderUpdate,
                                status: OrderStatus.Failed,
                                info: 'Order status changed to Failed. Please leave a review.'
                              },
                              user,
                              order.id
                            )
                          })
                          .then(notification => console.log('Notification made: ', notification))
                          .catch(err => console.log(err))
                      }}
                      title="Cancel"
                      id={index + 'cancel'}
                      style={{ marginTop: '5px' }}
                    />
                    <BlackButton
                      key={index + 'request'}
                      onClick={() => {
                        setCanUpdate(true)
                        order.status = RequestStatus.RequestDetails
                        setUpdateOrder(order)
                        getUser(order.customerID)
                          .then(user => {
                            return newNotification(
                              {
                                notificationType: NotificationType.OrderUpdate,
                                status: OrderStatus.MoreDetailsRequested,
                                info: 'Order status changed to More Details Requested'
                              },
                              user,
                              order.id
                            )
                          })
                          .then(notification => console.log('Notification made: ', notification))
                          .catch(err => console.log(err))
                      }}
                      title="Request More Details"
                      id={index + 'request'}
                      style={{ marginTop: '5px' }}
                    />
                  </div>
                )
              ) : null}

              {order.status == RequestStatus.RequestDetails && isApproved ? (
                isCustomer ? (
                  <div key={index + 'buttons'} className={classes.orderButtonsDiv}>
                    <BlackButton
                      key={index + 'request'}
                      onClick={() => {
                        setExistingOrder(order)
                        setRequestDetailsModalState('NEW') // Notification handled in modal
                      }}
                      title="Provide Details"
                      id={index + 'request'}
                      style={{ marginTop: '5px' }}
                    />
                    <BlackButton
                      key={index + 'cancel'}
                      onClick={() => {
                        setCanUpdate(true)
                        order.status = RequestStatus.Cancelled
                        setUpdateOrder(order)
                        getUser(order.customerID)
                          .then(user => {
                            return newNotification(
                              {
                                notificationType: NotificationType.OrderUpdate,
                                status: OrderStatus.Failed,
                                info: 'Order status changed to Failed. Please leave a review.'
                              },
                              user,
                              order.id
                            )
                          })
                          .then(notification => console.log('Notification made: ', notification))
                          .catch(err => console.log(err))
                      }}
                      title="Cancel"
                      id={index + 'cancel'}
                      style={{ marginTop: '5px' }}
                    />
                  </div>
                ) : (
                  <div key={index + 'buttons'} style={{ width: '50%' }} />
                )
              ) : null}

              {order.status == RequestStatus.RequestReview && isApproved ? (
                isCustomer ? (
                  <div key={index + 'buttons'} className={classes.orderButtonsDiv}>
                    <BlackButton
                      key={index + 'review'}
                      onClick={() => {
                        setExistingOrder(order)
                        setReviewModalState('NEW')
                      }}
                      title="Provide Review"
                      id={index + 'review'}
                      style={{ marginTop: '5px' }}
                    />
                  </div>
                ) : (
                  <div key={index + 'buttons'} style={{ width: '50%' }} />
                )
              ) : null}

              {order.status == RequestStatus.Delivered ||
              order.status == RequestStatus.Rejected ||
              order.status == RequestStatus.Cancelled ? (
                <div key={index + 'buttons'} style={{ width: '50%' }} />
              ) : null}
            </div>
          </div>
        )
      })}
    </>
  )
}

export default Orders
