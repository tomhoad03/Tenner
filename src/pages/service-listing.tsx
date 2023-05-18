import { useNavigate, useParams } from 'react-router-dom'
import {
  Day,
  ReviewSummary,
  Service,
  ServiceReview,
  getProfileServiceReviews,
  getReviewSummary,
  getService,
  getServiceReviews,
  groupAvailability
} from '../api/services'
import { StarRatingComponent } from '../components'
import { User, getUser } from '../api/user'
import { Colors, Labels } from '../styles'
import { useEffect, useState } from 'react'
import { verticalSeparator } from '../styles/components'
import { GreenButton, IconButton } from '../components/buttons'
import { largeText } from '../styles/labels'
import OrderModal from '../components/orderModal'
import ImageCarousel from '../components/imageCarousel'
import { PLACEHOLDER_ICON } from '../components/header'
import Review from '../components/review'
import { Avatar } from '@mui/material'

// TODO: Carousel for images
// TODO: Show service reviews and user average review
// TODO: Check that navigate to service provider profile works in context (once merged)
// TODO: Show location for service (figure out data structure???)
const ServiceListing = () => {
  const { serviceID } = useParams()
  const [service, setService] = useState<Service | undefined>()
  const [provider, setProvider] = useState<User | undefined>()
  const [serviceReviews, setServiceReviews] = useState<ServiceReview[]>([])
  const [profileRating, setProfileRating] = useState<ReviewSummary>()
  const [showOrder, setShowOrder] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (serviceID) {
      getService({ id: serviceID }).then(result => {
        if (result) {
          setService(result)

          getServiceReviews(serviceID).then(reviews => setServiceReviews(reviews))

          getUser(result.providerID).then(result => {
            setProvider(result)
          })

          getProfileServiceReviews(result.providerID).then(reviews => {
            setProfileRating(getReviewSummary(reviews))
          })
        }
      })
    }
  }, [])

  return (
    <div>
      <div style={{ paddingLeft: '20px', paddingRight: '20px', display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ ...Labels.heading, marginBottom: '0px' }}>{service?.name}</h1>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            height: '50px',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
          <IconButton onClick={() => navigate(`/profile/${provider?.id}`)}>
            <Avatar src={provider?.profileURL ?? PLACEHOLDER_ICON} style={{ marginRight: '5px' }} />
            <h2 style={Labels.subheading}>{provider?.username}</h2>
          </IconButton>
          <div style={{ ...verticalSeparator, borderColor: 'black', height: '80%' }} />
          {profileRating && profileRating?.total > 0 ? (
            <StarRatingComponent rating={profileRating?.rating ?? 0} ratingCount={profileRating?.total ?? 0} />
          ) : (
            <p style={Labels.text}>No Reviews</p>
          )}
        </div>
        <div style={{ flexDirection: 'row', display: 'flex' }}>
          <div style={{ flexDirection: 'column', display: 'flex', flex: 1, paddingRight: '100px' }}>
            <ImageCarousel images={service?.pictures ?? [require('../icons/sample_img.png')]} />
            <label style={{ ...Labels.subheading, marginTop: '18px' }} htmlFor="description">
              About this service
            </label>
            <h3 style={{ ...Labels.text, marginTop: '0px' }} id="description">
              {service?.description}
            </h3>
            <label style={{ ...Labels.subheading }} htmlFor="reviews">
              Reviews
            </label>
            <div id="reviews">
              {serviceReviews.length > 0 ? (
                serviceReviews.map(review => {
                  return <Review review={review} key={review.id} />
                })
              ) : (
                <p style={Labels.text}>No reviews</p>
              )}
            </div>
          </div>
          <div
            style={{
              flexDirection: 'column',
              display: 'flex',
              flex: 0.6,
              alignItems: 'center',
              paddingLeft: '40px'
            }}>
            <div
              style={{
                border: `2px solid ${Colors.light_gray}`,
                flexDirection: 'column',
                width: '100%',
                padding: '10px'
              }}>
              <label style={{ ...Labels.subheading }} htmlFor="availability">
                Availability
              </label>
              <div id="availability" style={{ display: 'flex', flexDirection: 'column' }}>
                {service?.availability
                  ? groupAvailability(service.availability).map((group, index) => {
                      return (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: '10px'
                          }}>
                          <p style={{ ...largeText, margin: 0 }}>
                            {group.days.length === 1
                              ? Day[Number(group.days[0])]
                              : `${Day[Number(group.days[0])]}-${Day[Number(group.days[group.days.length - 1])]}`}
                          </p>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-around'
                            }}>
                            {group.availability.split('#').map((timeRange, index) => {
                              return (
                                <p key={index} style={{ ...largeText, margin: 0, textAlign: 'right' }}>
                                  {timeRange}
                                </p>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })
                  : null}
              </div>
              <label style={{ ...Labels.subheading }} htmlFor="location">
                Location
              </label>
              <div id="location" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <p style={{ ...largeText, width: '60%' }}>{service?.location?.name ?? 'Online'}</p>
                <p style={largeText}>{`${service?.location?.r}km`}</p>
              </div>
              <div
                style={{
                  flexDirection: 'row',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                <h2 style={{ ...Labels.heading, margin: 0 }}>£{service?.price.toFixed(2)}</h2>
                <GreenButton title="Continue" onClick={() => setShowOrder(true)} style={{ width: '60%' }} />
              </div>
            </div>
            <h2 style={{ ...Labels.subheading, alignSelf: 'flex-start' }}>About the Seller</h2>
            <IconButton onClick={() => navigate(`/profile/${provider?.id}`)}>
              <Avatar
                src={provider?.profileURL ?? PLACEHOLDER_ICON}
                style={{
                  maxHeight: '200px',
                  maxWidth: '200px',
                  minHeight: '200px',
                  minWidth: '200px'
                }}
              />
            </IconButton>
            {profileRating && profileRating?.total > 0 ? (
              <StarRatingComponent rating={profileRating?.rating ?? 0} ratingCount={profileRating?.total ?? 0} />
            ) : (
              <p style={Labels.text}>No Reviews</p>
            )}
            <h2 style={{ ...Labels.text, alignSelf: 'flex-start' }}>{provider?.biography}</h2>
          </div>
        </div>
      </div>
      {service && provider && (
        <OrderModal isOpen={showOrder} requestClose={() => setShowOrder(false)} service={service} provider={provider} />
      )}
    </div>
  )
}

export default ServiceListing
