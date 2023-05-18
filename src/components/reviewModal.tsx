import React, { useState } from 'react'
import Modal from 'react-modal'
import { Buttons, TextArea } from '.'
import { newReview, NewServiceReviewParam, RequestStatus, ServiceRequest, updateServiceRequest } from '../api/services'
import { Components } from '../styles'
import { separator } from '../styles/components'
import { errorText as errorStyle } from '../styles/labels'
import ModalHeader from './modalHeader'
import TextField from './textField'
import { getUser } from '../api/user'
import { newNotification, NotificationType } from '../api/notifications'

export type ReviewModalState = 'NEW' | undefined

interface ReviewModalProps {
  isOpen: boolean
  requestClose: () => void
  existingOrder: ServiceRequest | undefined
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, requestClose, existingOrder }) => {
  const [reviewText, setReviewText] = useState<string | undefined>(undefined)
  const [rating, setRating] = useState<string | undefined>(undefined)
  const [errorText, setErrorText] = useState<string>('')

  const createReview = () => {
    if (!reviewText) {
      setErrorText('Please provide a review')
      return
    }
    if (!rating) {
      setErrorText('Please provide a rating')
      return
    }
    if (!Number(rating)) {
      if (Number(rating) >= 0 && Number(rating) <= 5) {
        setErrorText('Please provide a valid rating')
        return
      }
    }
    if (!existingOrder?.reviewID || !existingOrder?.customerID || !existingOrder?.providerID || !existingOrder?.id) {
      setErrorText('Invalid service request')
      return
    }

    const review: NewServiceReviewParam = {
      id: existingOrder?.reviewID !== undefined ? existingOrder?.reviewID : '',
      customerID: existingOrder?.customerID !== undefined ? existingOrder?.customerID : '',
      description: reviewText,
      providerID: existingOrder?.providerID !== undefined ? existingOrder?.providerID : '',
      rating: Number(Number(rating).toFixed(1)),
      serviceID: existingOrder?.serviceID !== undefined ? existingOrder?.serviceID : '',
      serviceRequestID: existingOrder?.id !== undefined ? existingOrder?.id : ''
    }
    existingOrder.status = RequestStatus.Delivered

    updateServiceRequest(existingOrder)
      .then(() => {
        newReview(review)
          .then(() => {
            return getUser(existingOrder?.providerID)
              .then(user => {
                return newNotification(
                  {
                    notificationType: NotificationType.Review,
                    rating: Number(rating),
                    info: reviewText
                  },
                  user,
                  existingOrder?.id
                )
              })
              .then(notification => {
                console.log('Notification made: ', notification)
              })
              .catch(err => {
                console.log(err)
              })
          })
          .then(() => {
            requestClose()
          })
          .catch(err => {
            console.log(err)
          })
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={requestClose} style={Components.modal}>
      <ModalHeader title="New Review" requestClose={requestClose} socialLogin={false} setErrorText={setErrorText} />
      <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
        <div style={separator}></div>
      </div>
      <TextArea title="Review Text" text={reviewText} setText={setReviewText} />
      <TextField title="Rating (Out of 5)" text={rating?.toString()} setText={setRating} />
      <Buttons.GreenButton onClick={createReview} title="Continue" style={{ marginTop: '10px' }} id="review_button" />
      {errorText ? (
        <label htmlFor="review_button" style={errorStyle}>
          {errorText}
        </label>
      ) : null}
    </Modal>
  )
}

export default ReviewModal
