import Modal from 'react-modal'
import { Components } from '../styles'
import NewServiceModal from './newServiceModal'
import { Availability, LocationData, Service, ServiceCategory } from '../api/services'
import { SetStateAction, useEffect, useState } from 'react'
import AvailabilityModal from './availabilityModal'
import LocationModalWithContext from './locationModal'

export type ServiceModalState = 'NEW' | 'LOCATION' | 'AVAILABILITY' | undefined

interface ServiceModalProps {
  isOpen: boolean
  requestClose: () => void
  serviceModalState: ServiceModalState
  setModalState: React.Dispatch<SetStateAction<ServiceModalState>>
  existingService?: Service
}

const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  requestClose,
  serviceModalState,
  setModalState,
  existingService
}) => {
  const [location, setLocation] = useState<LocationData>()
  const [availability, setAvailability] = useState<Availability | undefined>(existingService?.availability)
  const [title, setTitle] = useState<string | undefined>(existingService?.name)
  const [category, setCategory] = useState<ServiceCategory[]>(existingService?.category ?? [])
  const [description, setDescription] = useState<string | undefined>(existingService?.description)
  const [images, setImages] = useState<FileList | null>(null)
  const [price, setPrice] = useState<string | undefined>(existingService?.price.toFixed(2))

  useEffect(() => {
    setLocation(existingService?.location)
    setAvailability(existingService?.availability)
    setTitle(existingService?.name)
    setCategory(existingService?.category ?? [])
    setDescription(existingService?.description)
    setImages(null)
    setPrice(existingService?.price.toFixed(2))
  }, [existingService])

  const submitLocation = (name: string, lat: number, lng: number, r: number) => {
    setLocation({ name, lat, lng, r })
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={requestClose} style={Components.modal}>
      {serviceModalState === 'NEW' ? (
        <NewServiceModal
          serviceID={existingService?.id}
          requestClose={requestClose}
          setModalState={setModalState}
          location={location}
          availability={availability}
          title={title}
          category={category}
          description={description}
          images={images}
          price={price}
          setTitle={setTitle}
          setCategory={setCategory}
          setDescription={setDescription}
          setImages={setImages}
          setPrice={setPrice}
        />
      ) : null}
      {serviceModalState === 'LOCATION' ? (
        <LocationModalWithContext onClose={() => setModalState('NEW')} onSubmit={submitLocation} />
      ) : null}
      {serviceModalState === 'AVAILABILITY' ? (
        <AvailabilityModal
          requestClose={() => setModalState('NEW')}
          setAvailability={setAvailability}
          availability={availability}
        />
      ) : null}
    </Modal>
  )
}

export default ServiceModal
