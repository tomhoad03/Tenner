import React, { useState } from 'react'
import ModalHeader from './modalHeader'
import { errorText as errorStyle } from '../styles/labels'
import { separator } from '../styles/components'
import { Buttons, TextArea } from '.'
import { RequestStatus, ServiceRequest, updateServiceRequest } from '../api/services'
import Modal from 'react-modal'
import { Components } from '../styles'
import { NotificationType, newNotification } from '../api/notifications'
import { getUser } from '../api/user'

export type RequestDetailsModalState = 'NEW' | undefined

interface RequestDetailsModalProps {
  isOpen: boolean
  requestClose: () => void
  existingOrder: ServiceRequest | undefined
}

const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({ isOpen, requestClose, existingOrder }) => {
  const [requestDetailsText, setRequestDetailsText] = useState<string | undefined>(undefined)
  const [errorText, setErrorText] = useState<string>('')

  const createRequestDetails = () => {
    if (!requestDetailsText) {
      setErrorText('Please provide additional details')
      return
    }
    if (!existingOrder?.reviewID || !existingOrder?.customerID || !existingOrder?.providerID || !existingOrder?.id) {
      setErrorText('Invalid service request')
      return
    }

    existingOrder.status = RequestStatus.Approved
    const additionalDetailsPrefix = ' [Additional Details:'
    const additionalDetailsSuffix = ']'
    const additionalDetailsIndex = existingOrder.description.indexOf(additionalDetailsPrefix)

    if (additionalDetailsIndex >= 0) {
      const endIndex = existingOrder.description.indexOf(additionalDetailsSuffix, additionalDetailsIndex)
      const oldDetails = existingOrder.description.substring(
        additionalDetailsIndex + additionalDetailsPrefix.length,
        endIndex
      )
      existingOrder.description = existingOrder.description.replace(
        additionalDetailsPrefix + oldDetails + additionalDetailsSuffix,
        additionalDetailsPrefix + oldDetails + ', ' + requestDetailsText + additionalDetailsSuffix
      )
    } else {
      existingOrder.description += additionalDetailsPrefix + ' ' + requestDetailsText + additionalDetailsSuffix
    }

    updateServiceRequest(existingOrder)
      .then(serviceRequest => {
        console.log(serviceRequest)
        return getUser(serviceRequest.providerID)
          .then(user => {
            return newNotification(
              // Make a notification for the provider
              {
                notificationType: NotificationType.MoreInfoComplete,
                info: `More details provided: "${requestDetailsText}"`
              },
              user,
              serviceRequest.id
            )
          })
          .then(notification => {
            console.log('Notification made: ', notification)
          })
          .catch(err => {
            console.log(err)
          })
      })
      .catch(err => {
        console.log(err)
      })
    requestClose()
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={requestClose} style={Components.modal}>
      <ModalHeader title="Request Details" requestClose={requestClose} setErrorText={setErrorText} />
      <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
        <div style={separator}></div>
      </div>
      <TextArea
        title="Please provide additional details here"
        text={requestDetailsText}
        setText={setRequestDetailsText}
      />
      <Buttons.GreenButton
        onClick={createRequestDetails}
        title="Continue"
        style={{ marginTop: '10px' }}
        id="request_details_button"
      />
      {errorText ? (
        <label htmlFor="request_details_button" style={errorStyle}>
          {errorText}
        </label>
      ) : null}
    </Modal>
  )
}

export default RequestDetailsModal
