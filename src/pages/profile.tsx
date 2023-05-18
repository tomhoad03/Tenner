import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createUseStyles } from 'react-jss'
import { getAuth, onAuthStateChanged } from '@firebase/auth'
import { getCustomers, getUser, useGetUser, User } from '../api/user'
import {
  getAllServiceReviews,
  getServiceRequests,
  getServices,
  Service,
  ServiceRequest,
  ServiceReview,
  updateServiceReview,
  useGetServices
} from '../api/services'
import { PersonalDetailsComponent, ProfilePicComponent, StarRatingComponent, EditButtonComponent } from '../components'
import { GreenButton, IconButton } from '../components/buttons'
import ServiceModal, { ServiceModalState } from '../components/serviceModal'
import TextField from '@mui/material/TextField'
import { ProfileStyle, ServicesStyle, ReviewsStyle } from '../styles'
import { heading, modalSubtitle, subheading } from '../styles/labels'
import serviceImage from '../icons/service-image.svg'
import EditProfileModal, { EditProfileModalState } from '../components/editProfileModal'
import RequestProfileDetails from '../components/requestProfileDetails'
import RemoveReviewButtonComponent from '../components/remove-review-button'

const useStyles = createUseStyles({ ...ProfileStyle })
const useServicesStyles = createUseStyles({ ...ServicesStyle })
const useReviewsStyles = createUseStyles({ ...ReviewsStyle })

/**
 * Profile constructor
 */
const Profile = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  const { uid } = useParams()
  const [isPublic, setIsPublic] = useState<boolean>(true)
  const [isCustomer, setIsCustomer] = useState<boolean>(true)
  const [isApproved, setIsApproved] = useState<boolean>(false)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [reviews, setReviews] = useState<ServiceReview[] | null>([])
  const [editProfileModalState, setEditProfileModalState] = useState<EditProfileModalState>(undefined)
  const [requestDetails, showRequestDetails] = useState<boolean>(false)
  const newServices = useGetServices()

  if (uid == null) {
    return null
  }
  const user = useGetUser(uid)

  // Gets the profile user
  useEffect(() => {
    getUser(uid)
      .then(user => {
        // Checks if the profile is public
        const auth = getAuth()
        onAuthStateChanged(auth, user => {
          setIsPublic(user?.uid !== uid)
        })

        setIsCustomer(user?.type == 'Customer')
        setIsApproved(user.status == 'Approved' || user?.type == 'Customer')
        setIsAdmin(user?.type == 'Admin')
      })
      .catch(err => console.log(err))

    // Gets all the reviews
    getAllServiceReviews()
      .then(reviews => {
        setReviews(reviews)
      })
      .catch(err => console.log(err))
  }, [])

  // Gets the reviews score
  let userRating = 0
  let userRatingCount = 0
  reviews?.forEach(review => {
    if (review.providerID == uid) {
      userRating += review.rating
      userRatingCount++
      return
    }
  })

  return (
    <div>
      {!isPublic ? (
        <>
          <hr style={{ width: '100%' }} />
          <div style={{ display: 'flex', flexDirection: 'row', padding: '10px 10% 10px 10%' }}>
            <IconButton
              onClick={() => navigate(`/profile/${uid}`)}
              style={{ ...modalSubtitle, marginRight: '20px', color: 'black' }}>
              Profile
            </IconButton>
            <IconButton onClick={() => navigate(`/orders/${uid}`)} style={{ ...modalSubtitle, color: 'grey' }}>
              Orders
            </IconButton>
          </div>
          <hr style={{ width: '100%' }} />
        </>
      ) : null}

      <EditProfileModal
        isOpen={editProfileModalState !== undefined}
        requestClose={() => {
          setEditProfileModalState(undefined)
        }}
        user={user}
      />

      <div className={classes.mainDiv}>
        <div className={classes.rowDiv}>
          <div className={classes.columnDiv}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <ProfilePicComponent profileURL={user?.profileURL} />
              <h1 style={{ ...heading, padding: '0px 0px 0px 20px', textAlign: 'center' }}>{user?.username}</h1>
            </div>
            {!isCustomer ? (
              <StarRatingComponent rating={userRating / userRatingCount} ratingCount={userRatingCount} />
            ) : null}
          </div>
          <div className={classes.columnDiv}>
            <div></div>
            {!isPublic ? (
              <EditButtonComponent
                onClick={() => {
                  setEditProfileModalState('NEW')
                }}
              />
            ) : null}
          </div>
        </div>

        <div className={classes.rowDiv}>
          <div className={classes.borderedDiv}>
            <p>{user?.biography}</p>
          </div>
          <div className={classes.borderedDiv}>
            <PersonalDetailsComponent
              uid={uid}
              username={user?.username}
              location={user?.location}
              status={user?.status}
              isServiceProvider={user?.type == 'Provider'}
              showRequestDetails={showRequestDetails}
            />
          </div>
        </div>

        <div className={classes.rowDiv} style={{ display: !isCustomer ? 'flex' : 'none' }}>
          <div className={classes.borderedDiv}>{createServices(uid, isPublic, isApproved, newServices, reviews)}</div>
          <div className={classes.borderedDiv}>
            <div key="headerDiv" className={classes.columnHeaderDiv}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h2 key="title" style={{ ...subheading }}>
                  Reviews
                </h2>
              </div>
            </div>
            {createReviews(uid, isAdmin, newServices, reviews)}
          </div>
        </div>
      </div>
      {user && (
        <RequestProfileDetails isOpen={requestDetails} requestClose={() => showRequestDetails(false)} user={user} />
      )}
    </div>
  )
}

/**
 * Generates the individual services
 * @param uid The user id
 * @param isPublic Is the profile public
 * @param isApproved Is the profile approved
 *
 * TODO replace with simplified database calls
 * @param services The list of all services
 * @param reviews The list of all reviews
 */
const createServices = (
  uid: string,
  isPublic: boolean,
  isApproved: boolean,
  services: Service[] | null,
  reviews: ServiceReview[] | null
) => {
  const classes = useServicesStyles()
  const navigate = useNavigate()
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[] | null>([])
  const [serviceModalState, setServiceModalState] = useState<ServiceModalState>(undefined)
  const [editServiceModalState, setEditServiceModalState] = useState<ServiceModalState>(undefined)
  const [existingService, setExistingService] = useState<Service>()

  // Gets all the service requests
  useEffect(() => {
    getServiceRequests()
      .then(serviceRequests => {
        setServiceRequests(serviceRequests)
      })
      .catch(err => console.log(err))
  }, [serviceModalState, editServiceModalState])

  // Displays the services
  return (
    <>
      <ServiceModal
        isOpen={serviceModalState !== undefined}
        requestClose={() => setServiceModalState(undefined)}
        setModalState={setServiceModalState}
        serviceModalState={serviceModalState}
      />

      <ServiceModal
        isOpen={editServiceModalState !== undefined}
        requestClose={() => setEditServiceModalState(undefined)}
        serviceModalState={editServiceModalState}
        setModalState={setEditServiceModalState}
        existingService={existingService}
      />

      <div key="headerDiv" className={classes.columnHeaderDiv}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 key="title" style={{ ...subheading }}>
            Services
          </h2>
        </div>

        <div key="search" className={classes.searchServices}>
          <TextField
            title={''}
            id={'search-services'}
            onChange={() => {
              searchChange()
            }}
            placeholder="Search provider services..."
            style={{ textAlign: 'center', background: 'white', borderRadius: 4 }}
            size="small"
            InputProps={{
              style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
            }}
          />
          {!isPublic && isApproved ? (
            <GreenButton
              onClick={() => {
                setServiceModalState('NEW')
              }}
              title="New Service"
              id={'newService'}
              style={{ margin: '5px 5px 5px 5px', minHeight: '40px', width: '40%' }}
            />
          ) : null}
        </div>
      </div>

      {services?.map((service, index) => {
        // Only show services created by the service provider
        if (service?.providerID !== uid) {
          return null
        }

        // Gets the reviews score
        let serviceProviderRating = 0
        let serviceProviderRatingCount = 0
        reviews?.forEach(review => {
          const serviceRequest = serviceRequests?.find(serviceRequest => review.serviceRequestID == serviceRequest.id)
          if (serviceRequest?.serviceID == service.id) {
            serviceProviderRating += review.rating
            serviceProviderRatingCount++
          }
        })

        // Display a provider service
        return (
          <div key={service?.name + index} id={service?.name + index} className={classes.serviceDiv}>
            <img
              id="serviceImage"
              src={service?.pictures ? service?.pictures[0] : serviceImage}
              alt={'service-image'}
              className={classes.serviceImage}
              onClick={() => navigate(`${'/services/' + service.id}`)}></img>

            <div className={classes.rightServiceDiv}>
              <div className={classes.serviceDetailsDiv}>
                <div className={classes.serviceProviderNameDiv}>
                  <h3
                    style={{
                      ...subheading,
                      padding: '0px 50px 0px 0px',
                      width: '80%',
                      textOverflow: 'ellipsis',
                      overflow: 'clip'
                    }}>
                    {service?.name}
                  </h3>
                </div>
                {!isPublic && isApproved ? (
                  <EditButtonComponent
                    onClick={() => {
                      setExistingService(service)
                      setEditServiceModalState('NEW')
                    }}
                  />
                ) : null}
              </div>

              <p style={{ padding: '0px 0px 0px 5px' }}>{service?.description}</p>

              <div className={classes.serviceDetailsDiv}>
                <StarRatingComponent
                  rating={serviceProviderRating / serviceProviderRatingCount}
                  ratingCount={serviceProviderRatingCount}
                />
                <p style={{ padding: '0px 0px 0px 10px' }}>£{service?.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}

/**
 * Filter services by search bar
 */
const searchChange = () => {
  const serviceDivs = document.querySelectorAll("[class^='serviceDiv']")
  const searchBar = document.querySelector<HTMLInputElement>('#search-services')

  for (let i = 0; i < serviceDivs.length; i++) {
    const element = serviceDivs.item(i)
    if (element !== null) {
      const serviceDiv = document.getElementById(element.id)
      if (serviceDiv !== null && searchBar !== null) {
        const searchValues = searchBar.value.split(' ')
        for (const searchValue of searchValues) {
          if (serviceDiv.id.toString().toUpperCase().includes(searchValue.toUpperCase()) && searchValue !== '') {
            serviceDiv.style.display = 'flex'
            break
          } else if (searchValue != '') {
            serviceDiv.style.display = 'none'
          } else {
            serviceDiv.style.display = 'flex'
          }
        }
      }
    }
  }
}

/**
 * Displays the reviews
 * @param uid The user id
 * @param isAdmin Is the user an admin
 *
 * TODO replace with simplified database calls
 * @param services The list of all services
 * @param reviews THe list of all reviews
 */
const createReviews = (uid: string, isAdmin: boolean, services: Service[] | null, reviews: ServiceReview[] | null) => {
  const classes = useReviewsStyles()
  const [users, setUsers] = useState<User[] | null>([])
  const [orders, setOrders] = useState<ServiceRequest[] | null>([])

  // Gets all the customers
  useEffect(() => {
    getCustomers()
      .then(users => {
        setUsers(users)
      })
      .catch(err => console.log(err))

    // Gets all the service requests
    getServiceRequests()
      .then(orders => {
        setOrders(orders)
      })
      .catch(err => console.log(err))
  }, [])

  // Gets the reviews
  return (
    <>
      {reviews?.map((review, index) => {
        if (uid !== review.providerID || !review.status) return

        const user = users?.find(user => user.id == review.customerID)
        const order = orders?.find(order => order.id == review.serviceRequestID)
        const service = services?.find(service => service.id == order?.serviceID)

        return (
          <div
            key={index + 'div'}
            className={classes.reviewDiv}
            style={{ display: 'flex', padding: '10px 10px 10px 10px' }}>
            <div key={index + 'reviewDetails'} className={classes.reviewDetailsDiv}>
              <h3
                key={index + 'customerName'}
                style={{ ...subheading, width: '60%', textOverflow: 'ellipsis', overflow: 'clip' }}>
                {service?.name}
              </h3>
              <div>
                <StarRatingComponent key={index + 'stars'} rating={review.rating} />
              </div>
            </div>

            <p key={index + 'review'}>{review.description}</p>

            <div key={index + 'details'} className={classes.reviewRowDiv}>
              <PersonalDetailsComponent
                username={user?.username}
                location={user?.location}
                status={user?.status}
                isServiceProvider={false}
              />
              {isAdmin ? (
                <RemoveReviewButtonComponent
                  onClick={() => {
                    review.status = false
                    updateServiceReview(review)
                      .then(r => console.log(r))
                      .catch(err => console.log(err))
                  }}
                />
              ) : null}
            </div>
          </div>
        )
      })}
    </>
  )
}

export default Profile
