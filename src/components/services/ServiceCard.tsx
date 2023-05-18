import { Divider } from '@mui/material'
import { Stack } from '@mui/system'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Service, getReviewSummary, getServiceReviews } from '../../api/services'
import { User, getUser } from '../../api/user'
import { ReactComponent as StarIcon } from '../../icons/star-solid.svg'

type ServiceCardProps = {
  service: Service
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  // /////// //
  // ROUTING //
  // /////// //

  const navigate = useNavigate()

  // ///// //
  // STATE //
  // ///// //

  const [provider, setProvider] = useState<User>()
  const [rating, setRating] = useState<number>()
  const [numReviews, setNumReviews] = useState<string>()

  // /////// //
  // EFFECTS //
  // /////// //

  useEffect(() => {
    getUser(service.providerID)
      .then(provider => setProvider(provider))
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    getServiceReviews(service.id)
      .then(result => {
        const summary = getReviewSummary(result)
        setRating(summary.rating)
        setNumReviews(summary.numRatings)
      })
      .catch(err => console.log(err))
  })

  // ///////// //
  // COMPONENT //
  // ///////// //

  console.log(service.location)

  return (
    <div onClick={() => navigate(`/services/listing/${service.id}`)}>
      <Stack className="cursor-pointer -z-50 scale-100 hover:scale-105 hover:z-50 transition-all">
        {
          // ///// //
          // IMAGE //
          // ///// //
        }
        <img
          alt={service.id}
          src={
            service.pictures && service.pictures[0] !== '' ? service.pictures[0] : require('../../icons/sample_img.png')
          }
          style={{ aspectRatio: 5 / 3 }}
        />
        {
          // //// //
          // INFO //
          // //// //
        }
        <Stack className="border border-gray-200 box-border">
          <Stack className="p-3 justify-between h-[160px]" spacing={1}>
            {
              // //////// //
              // PROVIDER //
              // //////// //
            }
            <div className="font-semibold">
              {service.name}
              <div className="text-gray-500 text-sm font-normal">{provider?.username}</div>
            </div>
            {
              // /////////// //
              // DESCRIPTION //
              // /////////// //
            }
            <div className="line-clamp-2">{service.description}</div>
            {
              // /////// //
              // RATINGS //
              // /////// //
            }
            <Stack direction="row" spacing={1}>
              <StarIcon className="w-5 h-5 fill-yellow-500" />
              {numReviews === '0' ? (
                <div className="text-gray-500">{'No Revews'}</div>
              ) : (
                <Stack direction="row" spacing={1}>
                  <div className="text-yellow-500">{rating}</div>
                  <div className="text-gray-500">{'(' + numReviews + ')'}</div>
                </Stack>
              )}
            </Stack>
          </Stack>
          <Divider />
          {
            // ///// //
            // PRICE //
            // ///// //
          }
          <div className="p-3 text-right text-lg">{'£' + service.price.toFixed(2)}</div>
        </Stack>
      </Stack>
    </div>
  )
}

// ////////////// //
// HELPER METHODS //
// ////////////// //

function getNumberOfRatingsString(numberOfRatings: number) {
  if (numberOfRatings <= 1000) {
    return `${numberOfRatings}`
  } else {
    return `${Math.floor(numberOfRatings / 1000)}k+`
  }
}

export default ServiceCard
