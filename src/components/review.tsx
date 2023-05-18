import { createUseStyles } from 'react-jss'
import { ServiceReview } from '../api/services'
import { User, getUser } from '../api/user'
import { useEffect, useState } from 'react'
import { PLACEHOLDER_ICON } from './header'
import { IconButton } from './buttons'
import { Colors, Labels } from '../styles'
import { verticalSeparator } from '../styles/components'
import { StarRatingComponent } from './'

interface ReviewProps {
  review: ServiceReview
}

const Review: React.FC<ReviewProps> = ({ review }) => {
  const [user, setUser] = useState<User>()

  useEffect(() => {
    getUser(review.customerID).then(result => setUser(result))
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: `2px solid ${Colors.light_gray}`,
        borderRadius: '16px',
        padding: '10px',
        marginBottom: '20px'
      }}>
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            height: '50px',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
          <img src={user?.profileURL ?? PLACEHOLDER_ICON} height={'50px'} style={{ maxHeight: '50px' }} />
          <div></div>
          <h2 style={Labels.subheading}>{user?.username}</h2>
          <div style={{ ...verticalSeparator, borderColor: 'black', height: '80%' }} />
          {review.rating && <StarRatingComponent rating={review?.rating ?? 0} />}
        </div>
        <p style={Labels.text}>{review.description}</p>
      </div>
    </div>
  )
}

export default Review
