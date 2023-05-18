import React from 'react'
import removeReview from '../icons/remove-review-button.svg'

const RemoveReviewButtonComponent: React.FC<{ onClick?: React.MouseEventHandler<HTMLElement> }> = ({ onClick }) => {
  return (
    <a href="#" onClick={onClick} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <img src={removeReview} alt={'edit-button'} style={{ height: '40px', width: '40px' }} />
    </a>
  )
}

export default RemoveReviewButtonComponent
