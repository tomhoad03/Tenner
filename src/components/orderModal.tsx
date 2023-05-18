import Modal from 'react-modal'
import { Colors, Components, Labels } from '../styles'
import ModalHeader from './modalHeader'
import { LocationData, Service, newServiceRequest } from '../api/services'
import { User } from '../api/user'
import TextArea from './textArea'
import { useState } from 'react'
import { GreenButton } from './buttons'
import LocationModalWithContext from './locationModal'
import { textField } from '../styles/components'
import { NotificationType, newNotification } from '../api/notifications'

interface OrderModalProps {
  isOpen: boolean
  requestClose: () => void
  service: Service
  provider: User
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, requestClose, service, provider }) => {
  const [description, setDescription] = useState<string>()
  const [location, setLocation] = useState<LocationData>()
  const [state, setState] = useState<'ORDER' | 'LOCATION'>('ORDER')
  const [errorText, setErrorText] = useState<string>('')

  const submitLocation = (name: string, lat: number, lng: number, r: number) => {
    setLocation({ name, lat, lng, r })
  }

  const makeOrder = () => {
    setErrorText('')
    if (!description) {
      setErrorText('Please enter a description')
      return
    }
    newServiceRequest({
      serviceID: service.id,
      providerID: provider.id,
      description: description,
      cost: service.price,
      location: location
    })
      .then(serviceRequest => {
        console.log('Successfully created order: ', serviceRequest)
        newNotification(
          // Make a notification for the provider
          {
            notificationType: NotificationType.NewOrderPlaced,
            info: 'New order placed'
          },
          provider,
          serviceRequest.id
        )
          .then(notification => console.log('Notification made: ', notification))
          .catch(err => console.log(err))
        requestClose()
      })
      .catch(err => {
        console.log(err)
        setErrorText(err.message)
      })
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={requestClose} style={Components.modal}>
      {state === 'ORDER' ? (
        <>
          <ModalHeader title="Submit Order" requestClose={requestClose} />
          <h2 style={{ ...Labels.modalHeader, textAlign: 'center', marginTop: 0 }}>{provider.username}</h2>
          <div
            style={{
              border: `2px solid ${Colors.pale_gray}`,
              borderRadius: '10px',
              display: 'grid',
              columnGap: '16px',
              rowGap: '10px',
              padding: '10px',
              flex: 1,
              gridTemplateRows: 'auto 1fr auto auto auto'
            }}>
            <label style={{ ...Labels.textfieldLabel, gridColumn: 1, gridRow: 1 }}>Service title:</label>
            <label style={{ ...Labels.textfieldLabel, fontWeight: 'bold', gridColumn: 2, gridRow: 1 }}>
              {service.name}
            </label>
            <label style={{ ...Labels.textfieldLabel, gridColumn: 1, gridRow: 2 }}>Description:</label>
            <TextArea horizontal text={description} setText={setDescription} style={{ gridColumn: 2, gridRow: 2 }} />
            <label style={{ ...Labels.textfieldLabel, gridColumn: 1, gridRow: 3 }}>Location:</label>
            <button
              style={{ ...textField, textAlign: 'left', maxHeight: 'none' }}
              onFocus={e => (e.target.style.borderColor = Colors.light_gray)}
              onBlur={e => (e.target.style.borderColor = Colors.pale_gray)}
              id="location"
              onClick={() => setState('LOCATION')}>
              {location?.name}
            </button>
            <GreenButton
              title="Confirm"
              onClick={makeOrder}
              style={{ gridColumn: 2, gridRow: 4, width: '50%', justifySelf: 'flex-end', height: '40px' }}
            />
          </div>
          <label style={{ ...Labels.errorText, margin: 0 }}>{errorText}</label>
        </>
      ) : (
        <LocationModalWithContext onClose={() => setState('ORDER')} onSubmit={submitLocation} />
      )}
    </Modal>
  )
}

export default OrderModal
